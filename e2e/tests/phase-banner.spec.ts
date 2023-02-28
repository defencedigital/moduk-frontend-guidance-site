import { expect, test } from '@playwright/test'

test.describe('phase banner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has the correct feedback link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'feedback' })).toHaveAttribute(
      'href',
      'mailto:design-system@digital.mod.uk',
    )
  })
})
