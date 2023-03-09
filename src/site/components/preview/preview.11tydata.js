/* eslint-disable @typescript-eslint/no-var-requires */
const { globSync } = require('glob')
const { basename, dirname, join } = require('node:path')

const modukFrontendLibPath = dirname(require.resolve('@moduk/frontend'))
const frontendExamplesGlob = join(modukFrontendLibPath, 'nunjucks/**/__examples__/*.njk')
const paths = globSync(frontendExamplesGlob, { windowsPathsNoEscape: true }).sort()

const localExamplesGlob = join(__dirname, '../../_includes/moduk/components/**/__examples__/*.njk')
const localExamples = globSync(localExamplesGlob, { windowsPathsNoEscape: true })

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
