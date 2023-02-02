import { expect, test } from '@playwright/test'

import { ALL_PAGES } from './constants'

const MAX_HEIGHT = 30_000
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

          const boundingBox = selector ? await locator.boundingBox() : null

          if (!boundingBox || MAX_HEIGHT > boundingBox.height) {
            await expect(locator).toHaveScreenshot([
              screenshotName,
              'js-disabled.png',
            ], { scale: 'css', timeout: 20_000 })
            return
          }
          const remainders = boundingBox.height % MAX_HEIGHT ? [boundingBox.height % MAX_HEIGHT] : []

          const heights = [
            ...Array(Math.floor(boundingBox.height / MAX_HEIGHT)).fill(MAX_HEIGHT),
            ...remainders,
          ]
          // eslint-disable-next-line no-restricted-syntax
          for (const [index, height] of heights.entries()) {
            // eslint-disable-next-line no-await-in-loop
            await expect(page).toHaveScreenshot([
              screenshotName,
              `js-disabled-${index + 1}-of-${heights.length}.png`,
            ], {
              scale: 'css',
              timeout: 20_000,
              clip: {
                ...boundingBox,
                y: boundingBox.y + (MAX_HEIGHT * index),
                height,
              },
              fullPage: true,
            })
          }
        })
      })
    })
  })
})
