import { expect, test } from '@playwright/test'

test.describe('/components/accordion/preview/default', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/accordion/preview/default')
  })

  test('has the correct title tag', async ({ page }) => {
    await expect(page).toHaveTitle('Accordion preview – MOD.UK Design System')
  })

  test('has the correct heading', async ({ page }) => {
    const heading = page.getByRole('heading')
    await expect(heading).toHaveText('Accordion preview')
  })
})
