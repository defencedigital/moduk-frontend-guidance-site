import { expect, test } from '@playwright/test'

import { ALL_PAGES } from './constants'

test.describe('@accessibility', () => {
  ALL_PAGES.forEach(({ url }) => {
    test.describe(url, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url)
      })

      test('passes accessibility checks', async ({ page }) => {
        await expect(page).toHaveNoViolations()
      })
    })
  })
})
