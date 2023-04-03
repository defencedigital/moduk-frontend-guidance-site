import { mapValues } from 'lodash'

export const FIGMA_BASE_URL = 'https://www.figma.com/file/JrmVrSdKCHUZBQFEB3xsjJ/Figma-Design-Library'

export function getFigmaURLs(nodeIds: Record<string, string>) {
  /*
    https://www.figma.com/developers/api#files-endpoints
    The node Id and file key can be parsed from any Figma node url: https://www.figma.com/file/:key/:title?node-id=:id.
    */

  const url = new URL(FIGMA_BASE_URL)
  return mapValues(nodeIds, (nodeId) => {
    url.searchParams.set('node-id', nodeId)
    return url.href
  })
}
