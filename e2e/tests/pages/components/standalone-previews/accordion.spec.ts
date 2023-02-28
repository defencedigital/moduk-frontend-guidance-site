import { expect, test } from '@playwright/test'

test.describe('/components/accordion/preview/default', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/accordion/preview/default')
  })

  test('has the correct title tag', async ({ page }) => {
    await expect(page).toHaveTitle('Accordion preview – MOD.UK Design System')
  })

  test('has the noindex meta tag', async ({ page }) => {
    const html = await page.content()
    await expect(html).toContain('<meta name="robots" content="noindex, nofollow">')
  })

  test('has the correct heading', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toHaveText('Accordion preview preview')
  })
})
