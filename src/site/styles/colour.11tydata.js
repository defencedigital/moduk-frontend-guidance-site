const { getColours } = require('../../lib')

module.exports = async function getColourData() {
  return {
    colours: await getColours(),
  }
}
