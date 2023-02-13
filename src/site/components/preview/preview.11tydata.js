/* eslint-disable @typescript-eslint/no-var-requires */
const glob = require('glob')
const { basename, dirname, join } = require('node:path')

const modukFrontendLibPath = dirname(require.resolve('@moduk/frontend'))
const paths = glob.sync(join(modukFrontendLibPath, 'nunjucks/**/__examples__/*.njk'))
const localExamples = glob.sync(join(__dirname, '../../_includes/moduk/components/**/__examples__/*.njk'))

const examples = [...paths, ...localExamples].map((path) => {
  const componentName = basename(dirname(dirname(path)))
  const exampleName = basename(path, '.njk')
  const template = `moduk/components/${componentName}/__examples__/${exampleName}.njk`

  return {
    componentName,
    exampleName,
    template,
  }
})

module.exports = {
  examples,
  visual_regression: {
    selector: undefined,
  },
}
