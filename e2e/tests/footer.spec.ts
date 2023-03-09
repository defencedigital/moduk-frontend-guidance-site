import { expect, test } from '@playwright/test'

test.describe('footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has the correct links', async ({ page }) => {
    const links = page.locator('footer .govuk-footer__inline-list').getByRole('link')
    await expect(links).toHaveCount(2)
    await expect(links.nth(0)).toHaveAttribute('href', '/cookies/')
    await expect(links.nth(1)).toHaveAttribute('href', '/accessibility-statement/')
  })
})
