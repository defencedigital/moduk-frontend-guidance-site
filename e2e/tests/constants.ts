import pageList from '../../dist/page-list.json'

export const ALL_PAGES = pageList.map(({ url, ...rest }) => ({
  url,
  screenshotName: url.replaceAll(/(^\/|\/$)/g, ''),
  ...rest,
}))
