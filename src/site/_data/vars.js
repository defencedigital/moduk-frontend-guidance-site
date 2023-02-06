const contactEmail = 'design-system@digital.mod.uk'

module.exports = {
  contactEmail,
  baseUrl: process.env.BASE_URL
    ? process.env.BASE_URL.replaceAll(/\/$/g, '')
    : 'https://design-system.service.mod.gov.uk',
  markdownContactEmailLink: `[${contactEmail}](mailto:${contactEmail})`,
  noIndex: Boolean(process.env.NO_INDEX),
}
