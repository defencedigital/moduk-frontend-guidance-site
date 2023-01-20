import { expect, test } from '@playwright/test'

test.describe('/components/back-link/', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/back-link/')
  })

  test('has the correct title tag', async ({ page }) => {
    await expect(page).toHaveTitle('Back link – MOD.UK Design System')
  })
})
