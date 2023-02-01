import { expect, test } from '@playwright/test'

import { ALL_PAGES } from './constants'

test.describe('@visual-regression', () => {
  ALL_PAGES.forEach(({ url, screenshotName, visualRegression: { selector } }) => {
    test.describe(url, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url)
      })

      test('matches the saved screenshot', async ({ page }) => {
        const locator = selector ? page.locator(selector) : page.getByRole('document')

        await expect(locator).toHaveScreenshot([
          screenshotName,
          'js-enabled.png',
        ], { scale: 'css', timeout: 20_000 })
      })

      test.describe('when JavaScript is disabled', () => {
        test.use({ javaScriptEnabled: false })

        test('matches the saved screenshot', async ({ page }) => {
          const locator = selector ? page.locator(selector) : page.getByRole('document')

          await expect(locator).toHaveScreenshot([
            screenshotName,
            'js-disabled.png',
          ], { scale: 'css', timeout: 20_000 })
        })
      })
    })
  })
})
