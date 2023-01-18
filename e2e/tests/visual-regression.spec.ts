import { expect, test } from '@playwright/test'

import { ALL_PAGES } from './constants'

test.describe('@visual-regression', () => {
  ALL_PAGES.forEach(({ url, screenshotName }) => {
    test.describe(url, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url)
      })

      test('matches the saved screenshot', async ({ page }) => {
        await expect(page.getByRole('document')).toHaveScreenshot([
          screenshotName,
          'screenshot.png',
        ])
      })
    })
  })
})
