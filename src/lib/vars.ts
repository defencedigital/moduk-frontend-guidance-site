export * from './cookieSettings'

export const baseUrl = process.env.BASE_URL
  ? process.env.BASE_URL.replaceAll(/\/$/g, '')
  : 'https://design-system.service.mod.gov.uk'
export const contactEmail = 'design-system@digital.mod.uk'
export const figmaLink =
  'https://www.figma.com/file/JrmVrSdKCHUZBQFEB3xsjJ/Design-Library?node-id=50%3A5303&t=xG6UMcIDeLIbH1kD-1'
export const hostname = new URL(baseUrl).host
export const markdownContactEmailLink = `[${contactEmail}](mailto:${contactEmail})`
export const noIndex = Boolean(process.env.NO_INDEX)
