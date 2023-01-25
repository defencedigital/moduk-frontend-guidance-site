/* eslint-disable @typescript-eslint/no-var-requires */
require('ts-node').register({
  project: 'tsconfig.json',
})

const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const autoprefixer = require('autoprefixer')
const revPlugin = require('eleventy-plugin-rev')
const sassPlugin = require('eleventy-sass')
const { get, sortBy } = require('lodash')
const { readFileSync } = require('node:fs')
const { join, relative } = require('node:path')
const postcss = require('postcss')
const postcssFailOnWarn = require('postcss-fail-on-warn')
const prettier = require('prettier')
const webpack = require('webpack')
const { createNunjucksEnvironment, getNunjucksPaths } = require('@moduk/frontend')

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

  const nunjucksEnv = createNunjucksEnvironment([join(__dirname, 'src/site/_includes')], {
    trimBlocks: true,
    lstripBlocks: true,
  })
  config.setLibrary('njk', nunjucksEnv)
  config.addNunjucksFilter('rejectattr_path', (array, propertyPath) => (
    array && array.filter((item) => !get(item, propertyPath))
  ))

  config.addNunjucksFilter('selectattr_path', (array, propertyPath) => (
    array && array.filter((item) => get(item, propertyPath))
  ))

  config.addNunjucksFilter('isUrlInCollection', (array, url) => (
    array && array.some((item) => item.url === url)
  ))

  config.addNunjucksFilter('sortBy', (array, sortByKeys) => (
    array && sortBy(array, sortByKeys)
  ))

  config.addShortcode('readTemplate', (filePath) => {
    const templateDirs = getNunjucksPaths()
    // eslint-disable-next-line no-restricted-syntax
    for (const templateDir of templateDirs) {
      try {
        return readFileSync(join(templateDir, filePath), 'utf8')
      } catch {
        /* Try the next include directory on error */
      }
    }
    throw new Error('readTemplate tag: unexpectedly reached end of template include directories')
  })

  config.addShortcode(
    'renderToString',
    (filePath) => prettier.format(nunjucksEnv.render(filePath, {}), { parser: 'html' }),
  )

  config.addPassthroughCopy({ 'node_modules/@moduk/frontend/dist/assets': 'assets' })
  config.addPassthroughCopy({ 'src/site/_public': '.' })

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
