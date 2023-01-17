import { expect, test } from '@playwright/test'

test.describe('/get-started/', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/get-started/using-nunjucks/')
  })

  test('has the correct title tag', async ({ page }) => {
    await expect(page).toHaveTitle('Using Nunjucks – MOD.UK Design System')
  })
})
