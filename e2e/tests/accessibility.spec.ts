import { expect, test } from '@playwright/test'

import { ALL_PAGES } from './constants'

const DISABLED_RULES: Record<string, string[]> = {
  '/components/character-count/': ['heading-order'],
  '/components/date-input/': ['heading-order'],
}

test.describe('@accessibility', () => {
  ALL_PAGES.forEach(({ url }) => {
    test.describe(url, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url)
      })

      test('passes accessibility checks', async ({ page }) => {
        const disabledRules = DISABLED_RULES[url] || []
        await expect(page).toHaveNoViolations(disabledRules)
      })
    })
  })
})
