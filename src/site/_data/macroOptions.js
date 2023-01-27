// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getAllComponentNames, getMacroOptions } = require('../../lib')

module.exports = async function getAllMacroOptions() {
  const componentNames = getAllComponentNames()
  const componentOptions = []
  // Note that parallelising these causes all components to have the same macro options
  // Probably caused by https://github.com/microsoft/TypeScript/issues/51554
  // (fixed in TypeScript 5)
  // eslint-disable-next-line no-restricted-syntax
  for (const componentName of componentNames) {
    // eslint-disable-next-line no-await-in-loop
    componentOptions.push([componentName, await getMacroOptions(componentName)])
  }
  return Object.fromEntries(componentOptions)
}
