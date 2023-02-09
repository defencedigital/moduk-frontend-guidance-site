const contactEmail = 'design-system@digital.mod.uk'

module.exports = {
  baseUrl: process.env.BASE_URL
    ? process.env.BASE_URL.replaceAll(/\/$/g, '')
    : 'https://design-system.service.mod.gov.uk',
  contactEmail,
  figmaLink: 'https://www.figma.com/file/JrmVrSdKCHUZBQFEB3xsjJ/Design-Library?node-id=50%3A5303&t=xG6UMcIDeLIbH1kD-1',
  markdownContactEmailLink: `[${contactEmail}](mailto:${contactEmail})`,
  noIndex: Boolean(process.env.NO_INDEX),
}
