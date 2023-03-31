import { describe, expect, it } from 'vitest'
import { FIGMA_BASE_URL, getFigmaURLs } from '../getFigmaURLs'

describe('getFigmaURLs', () => {
  it('returns urls for figma', () => {
    expect(getFigmaURLs({
      typography: '1-2',
      spacing: '2-3',
      layouts: '4-5',
    })).toMatchObject(
      {
        typography: `${FIGMA_BASE_URL}?node-id=1-2`,
        spacing: `${FIGMA_BASE_URL}?node-id=2-3`,
        layouts: `${FIGMA_BASE_URL}?node-id=4-5`,
      },
    )
  })
})
