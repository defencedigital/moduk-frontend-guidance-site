import { expect, test } from '@playwright/test'

test.describe('Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has the correct title tag', async ({ page }) => {
    expect(await page.title()).toBe('Home – MOD.UK Design System')
  })

  test('has the correct heading', async ({ page }) => {
    await expect(page.getByRole('heading')).toHaveText('Content to be added')
  })
})
