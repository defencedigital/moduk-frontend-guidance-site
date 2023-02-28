import { expect, test } from '@playwright/test'

test.describe('/get-started/', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/get-started/setup-guide-for-developers/')
  })

  test('has the correct title tag', async ({ page }) => {
    await expect(page).toHaveTitle('Setup guide for developers – MOD.UK Design System')
  })
})
