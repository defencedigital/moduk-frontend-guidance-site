import { expect, test } from '@playwright/test'

import { baseUrl } from '../../src/lib/vars'

test.describe('non-existent page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/non-existent-page/')
  })

  test('displays a page not found error', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
  })

  test('does not set the description meta tag', async ({ page }) => {
    const html = await page.content()
    await expect(html).not.toContain('<meta name="description"')
    await expect(html).not.toContain('<meta property="og:description"')
  })

  test('links to the base URL', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'browse from the homepage' })).toHaveAttribute('href', baseUrl)
  })
})
