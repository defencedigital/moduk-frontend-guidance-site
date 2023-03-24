import { describe, expect, it } from 'vitest'
import { getColours } from '../getColours'

describe('getColours', () => {
  it('returns colours and hex codes', async () => {
    expect(await getColours()).toMatchObject(
      {
        'moduk-brand-colour': '#532a45',
        'dark-purple': '#532a45',
        'muted-grey': '#7b98ac',
        'bright-pink': '#f087cf',
      },
    )
  })
})
