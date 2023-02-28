import { expect, test } from '@playwright/test'

test.describe('/components/accordion/preview/default/embed.html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/accordion/preview/default/embed.html')
  })

  test('has the correct title tag', async ({ page }) => {
    await expect(page).toHaveTitle('Accordion preview – MOD.UK Design System')
  })

  test('has the noindex meta tag', async ({ page }) => {
    const html = await page.content()
    await expect(html).toContain('<meta name="robots" content="noindex, nofollow">')
  })
})
