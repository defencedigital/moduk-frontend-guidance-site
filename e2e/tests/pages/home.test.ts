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
    await expect(page.getByRole('heading', { level: 2, name: 'Updates' })).toBeVisible()
  })

  test.describe('navigation', () => {
    test.describe('@tablet-and-desktop', () => {
      test('navigation is visible', async ({ page }) => {
        await expect(page.getByRole('navigation', { name: 'Menu' })).toBeVisible()
      })
    })

    test.describe('@mobile', () => {
      test('navigation is hidden', async ({ page }) => {
        await expect(page.getByRole('navigation', { name: 'Menu' })).toBeHidden()
      })

      test('clicking menu toggles navigation menu', async ({ page }) => {
        await page.getByRole('button', { name: 'Menu' }).click()

        await expect(page.getByRole('navigation', { name: 'Menu' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true')

        await page.getByRole('button', { name: 'Menu' }).click()

        await expect(page.getByRole('navigation', { name: 'Menu' })).toBeHidden()
        await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
      })

      test.describe('@visual-regression', () => {
        test('matches the saved screenshot', async ({ page }) => {
          await page.getByRole('button', { name: 'Menu' }).click()
          await expect(page.getByRole('document')).toHaveScreenshot(
            'mobile-menu-expanded-screenshot.png',
          )
        })
      })
    })
  })
})
