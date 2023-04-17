import { expect, test } from '@playwright/test'

import { ALL_PAGES } from './constants'

const excludedElements = [
  // Not contained in a landmark, in line with https://design-system.service.gov.uk/
  '.guidance-back-to-top',
]

test.describe('@accessibility', () => {
  ALL_PAGES.forEach(({ url, axeDisabledRules }) => {
    test.describe(url, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url)
      })

      test('passes accessibility checks', async ({ page }) => {
        await expect(page).toHaveNoViolations(axeDisabledRules, excludedElements)
      })
    })
  })
})
