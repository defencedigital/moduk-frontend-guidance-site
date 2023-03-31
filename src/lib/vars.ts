import { getFigmaURLs } from './getFigmaURLs'

export * from './cookieSettings'

export const baseUrl = process.env.BASE_URL
  ? process.env.BASE_URL.replaceAll(/\/$/g, '')
  : 'https://design-system.service.mod.gov.uk'
export const contactEmail = 'design-system@digital.mod.uk'
export const figmaURLs = getFigmaURLs({
  designLibrary: '50-5303',
  typography: '2589-17241',
  spacing: '2589-16884',
  layout: '749-13252',
})

export const hostname = new URL(baseUrl).host
export const markdownContactEmailLink = `[${contactEmail}](mailto:${contactEmail})`
export const noIndex = Boolean(process.env.NO_INDEX)
