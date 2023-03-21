// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getAllComponentNames, getMacroOptions } = require('../../lib')

module.exports = async function getAllMacroOptions() {
  const componentNames = getAllComponentNames()
  const componentOptions = await Promise.all(
    componentNames.map(async (componentName) => [componentName, await getMacroOptions(componentName)]),
  )
  return Object.fromEntries(componentOptions)
}
