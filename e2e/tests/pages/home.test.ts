import { expect, test } from '@playwright/test'

test.describe('Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has the correct title tag', async ({ page }) => {
    await expect(page).toHaveTitle('Home – MOD.UK Design System')
  })

  test('has the correct level 1 heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Design and build consistent Defence services')
  })

  test('navigates to the get started page after clicking the start button', async ({ page }) => {
    await page.getByRole('button', { name: 'Get started' }).click()

    await expect(page).toHaveURL(/.*\/get-started\//)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Get started')
  })

  test('has the correct level 2 heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('Updates')
  })
})
