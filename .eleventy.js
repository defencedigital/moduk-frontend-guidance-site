/* eslint-disable @typescript-eslint/no-var-requires */
require('ts-node').register({
  project: 'tsconfig.json',
})

const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const autoprefixer = require('autoprefixer')
const revPlugin = require('eleventy-plugin-rev')
const sassPlugin = require('eleventy-sass')
const { get } = require('lodash')
const { join, relative } = require('node:path')
const postcss = require('postcss')
const postcssFailOnWarn = require('postcss-fail-on-warn')
const webpack = require('webpack')
const { createNunjucksEnvironment } = require('@moduk/frontend')

const webpackConfig = require('./webpack.config')

module.exports = (config) => {
  config.addPlugin(revPlugin)
  config.addPlugin(sassPlugin, {
    rev: true,
    sass: {
      loadPaths: ['node_modules'],
      quietDeps: true,
    },
    postcss: postcss([
      autoprefixer,
      postcssFailOnWarn,
    ]),
  })
  config.addPlugin(syntaxHighlight, {
    preAttributes: {
      tabindex: 0,
    },
  })

  const nunjucksEnv = createNunjucksEnvironment([join(__dirname, 'src/site/_includes')])
  config.setLibrary('njk', nunjucksEnv)
  config.addNunjucksFilter('rejectattr_path', (array, propertyPath) => (
    array.filter((item) => !get(item, propertyPath))
  ))

  config.addPassthroughCopy({ 'node_modules/@moduk/frontend/dist/assets': 'assets' })

  config.addTemplateFormats('ts')
  config.addExtension('ts', {
    read: false,
    permalink: false,
    outputFileExtension: 'js',
    getData: () => ({
      eleventyExcludeFromCollections: true,
    }),
    compile: async (_inputContent, filename) => {
      const compiler = webpack({
        ...webpackConfig,
        entry: filename,
      })

      return () =>
        new Promise((resolve, reject) => {
          compiler.run((err, stats) => {
            compiler.close((closeErr) => {
              if (err || closeErr) {
                reject(err)
              } else {
                stats.compilation.assetsInfo.forEach((_value, outFile) => {
                  // eslint-disable-next-line no-console
                  console.log(
                    `[Webpack] Writing ${join(relative(__dirname, compiler.outputPath), outFile)} from ${filename}`,
                  )
                })
                resolve()
              }
            })
          })
        })
    },
  })

  return {
    dir: {
      data: 'data',
      input: 'src/site',
      output: 'dist',
    },
    markdownTemplateEngine: 'njk',
  }
}
