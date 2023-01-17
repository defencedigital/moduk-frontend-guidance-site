/* eslint-disable @typescript-eslint/no-var-requires */
require('ts-node').register({
  project: 'tsconfig.json',
})

const autoprefixer = require('autoprefixer')
const revPlugin = require('eleventy-plugin-rev')
const sassPlugin = require('eleventy-sass')
const { join } = require('node:path')
const postcss = require('postcss')
const postcssFailOnWarn = require('postcss-fail-on-warn')

const { createNunjucksEnvironment } = require('@moduk/frontend')

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
  const nunjucksEnv = createNunjucksEnvironment([join(__dirname, 'src/site/_includes')])
  config.setLibrary('njk', nunjucksEnv)
  config.addPassthroughCopy({ 'node_modules/@moduk/frontend/dist/assets': 'assets' })
  config.addPassthroughCopy({
    'node_modules/@moduk/frontend/dist/client/moduk-frontend.umd.js': 'moduk-frontend.umd.js',
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
