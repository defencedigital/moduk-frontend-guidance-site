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
          'js-enabled.png',
        ], { scale: 'css', timeout: 20_000 })
      })

      test.describe('when JavaScript is disabled', () => {
        test.use({ javaScriptEnabled: false })

        test('matches the saved screenshot', async ({ page }) => {
          await expect(page.getByRole('document')).toHaveScreenshot([
            screenshotName,
            'js-disabled.png',
          ], { scale: 'css', timeout: 20_000 })
        })
      })
    })
  })
})
