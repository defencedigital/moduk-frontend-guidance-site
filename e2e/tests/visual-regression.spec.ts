import { expect, test } from '@playwright/test'

import { ALL_PAGES } from './constants'

const SCREENSHOT_OPTIONS = { scale: 'css', timeout: 20_000 } as const

test.describe('@visual-regression', () => {
  ALL_PAGES.forEach(({ url, screenshotName, visualRegression: { selector, skip_js_disabled: skipJsDisabled } }) => {
    test.describe(url, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url)
      })

      test('matches the saved screenshot', async ({ page }) => {
        const filenameParts = [screenshotName, 'js-enabled.png']

        if (selector) {
          await expect(page.locator(selector)).toHaveScreenshot(filenameParts, SCREENSHOT_OPTIONS)
        } else {
          await expect(page).toHaveScreenshot(filenameParts, { ...SCREENSHOT_OPTIONS, fullPage: true })
        }
      })

      if (!skipJsDisabled) {
        test.describe('when JavaScript is disabled', () => {
          test.use({ javaScriptEnabled: false })

          test('matches the saved screenshot', async ({ page }) => {
            const filenameParts = [screenshotName, 'js-disabled.png']

            if (selector) {
              await expect(page.locator(selector)).toHaveScreenshot(filenameParts, SCREENSHOT_OPTIONS)
            } else {
              await expect(page).toHaveScreenshot(filenameParts, { ...SCREENSHOT_OPTIONS, fullPage: true })
            }
          })
        })
      }
    })
  })
})
