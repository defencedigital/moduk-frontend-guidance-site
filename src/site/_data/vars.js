// eslint-disable-next-line @typescript-eslint/no-var-requires
const { googleTagId, cookiePreferenceKey } = require('../../lib/cookieSettings')

const contactEmail = 'design-system@digital.mod.uk'
const baseUrl = process.env.BASE_URL
  ? process.env.BASE_URL.replaceAll(/\/$/g, '')
  : 'https://design-system.service.mod.gov.uk'

module.exports = {
  baseUrl,
  contactEmail,
  figmaLink: 'https://www.figma.com/file/JrmVrSdKCHUZBQFEB3xsjJ/Design-Library?node-id=50%3A5303&t=xG6UMcIDeLIbH1kD-1',
  hostname: new URL(baseUrl).host,
  markdownContactEmailLink: `[${contactEmail}](mailto:${contactEmail})`,
  noIndex: Boolean(process.env.NO_INDEX),
  googleTagId,
  cookiePreferenceKey,
}
