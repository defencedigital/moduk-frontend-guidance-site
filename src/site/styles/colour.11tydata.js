// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getColours } = require('../../lib')

module.exports = async function getColourData() {
  return {
    colours: await getColours(),
  }
}
