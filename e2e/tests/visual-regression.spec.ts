import { expect, test } from '@playwright/test'

const URLS = [{ url: '/', name: 'home' }]

test.describe('@visual-regression', () => {
  URLS.forEach(({ url, name }) => {
    test.describe(url, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url)
      })

      test('matches the saved screenshot', async ({ page }) => {
        await expect(page.getByRole('document')).toHaveScreenshot([
          name,
          'screenshot.png',
        ])
      })
    })
  })
})
