/* eslint-disable @typescript-eslint/no-var-requires */
require('ts-node').register()

const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const revPlugin = require('eleventy-plugin-rev')
const sassPlugin = require('eleventy-sass')
const { minify } = require('html-minifier-terser')
const { get, kebabCase, sortBy } = require('lodash')
const MarkdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const { parse } = require('node-html-parser')
const { readFileSync } = require('node:fs')
const { join, relative } = require('node:path')
const { runtime: { SafeString } } = require('nunjucks')
const postcss = require('postcss')
const postcssFailOnWarn = require('postcss-fail-on-warn')
const postcssPresetEnv = require('postcss-preset-env')
const prettier = require('@prettier/sync')
const webpack = require('webpack')
const { createNunjucksEnvironment, getNunjucksPaths } = require('@moduk/frontend')

const webpackConfig = require('./webpack.config')

const templatePath = join(__dirname, 'src/site/_includes')

module.exports = (config) => {
  config.addPlugin(revPlugin)
  config.addPlugin(sassPlugin, {
    rev: true,
    sass: {
      loadPaths: ['node_modules'],
      quietDeps: true,
    },
    postcss: postcss([
      postcssPresetEnv(),
      postcssFailOnWarn,
    ]),
  })
  config.addPlugin(syntaxHighlight, {
    lineSeparator: '<br>',
    preAttributes: {
      tabindex: 0,
    },
  })

  config.amendLibrary('md', (mdLib) => mdLib.use(markdownItAnchor))

  const nunjucksEnv = createNunjucksEnvironment([templatePath], {
    trimBlocks: true,
    lstripBlocks: true,
  })
  config.setLibrary('njk', nunjucksEnv)

  config.addNunjucksGlobal('flags', {
    showReactCodeSnippets: (process.env.SHOW_REACT_CODE_SNIPPETS ?? '').toLowerCase() === 'true',
  })

  const markdownIt = new MarkdownIt()
  config.addFilter('markdown', (markdown) => markdown && new SafeString(markdownIt.render(markdown)))

  config.addFilter('kebabCase', (value) => value && kebabCase(value))

  config.addFilter('rejectattr_path', (array, propertyPath) => (
    array && array.filter((item) => !get(item, propertyPath))
  ))

  config.addFilter('selectattr_path', (array, propertyPath) => (
    array && array.filter((item) => get(item, propertyPath))
  ))

  config.addFilter('isUrlInCollection', (array, url) => (
    array && array.some((item) => item.url === url)
  ))

  config.addFilter('sortBy', (array, sortByKeys) => (
    array && sortBy(array, sortByKeys)
  ))

  config.addNunjucksShortcode(
    'renderMinified',
    (filePath) => parse(nunjucksEnv.render(filePath, {})).removeWhitespace().toString(),
  )

  config.addShortcode('readTemplate', (filePath) => {
    const templateDirs = [...getNunjucksPaths(), templatePath]
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

  config.addShortcode('readReactExample', (componentName, exampleName) => {
    try {
      const examplePath = require.resolve(`@moduk/frontend/src/react/${componentName}/__examples__/${exampleName}.tsx`)
      const code = readFileSync(examplePath, 'utf8')
      return prettier.format(code, { parser: 'typescript' })
    } catch {
      return ''
    }
  })

  config.addShortcode(
    'renderToString',
    (filePath) => prettier.format(nunjucksEnv.render(filePath, {}), { parser: 'html' }),
  )

  config.addCollection('footerLinks', (collectionApi) =>
    collectionApi.getFilteredByTag(
      'footer',
    ).sort(
      (left, right) => left.data.order - right.data.order,
    ).map(
      (page) => ({ text: page.data.title, href: page.url }),
    ))

  config.addPassthroughCopy({ 'node_modules/@moduk/frontend/dist/assets': 'assets' })
  config.addPassthroughCopy({
    'node_modules/iframe-resizer/js/iframeResizer.contentWindow.min.js': 'iframeResizer.contentWindow.min.js',
  })
  config.addPassthroughCopy({ 'src/site/_public': '.' })

  config.addExtension('md-njk', {
    key: 'njk',
    getData: (inputPath) => {
      if (inputPath.match(/\.md-njk$/)) {
        return {
          templateEngineOverride: 'njk,md',
        }
      }

      return {}
    },
  })

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

  config.addTransform('htmlMinify', (content, outputPath) => {
    if (outputPath && !outputPath.endsWith('.html')) {
      return content
    }
    return minify(content, {
      collapseWhitespace: true,
      conservativeCollapse: true,
    })
  })

  return {
    dir: {
      input: 'src/site',
      output: 'dist',
    },
    markdownTemplateEngine: false,
  }
}
