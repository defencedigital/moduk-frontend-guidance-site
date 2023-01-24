import { expect, Locator, test as playwrightTest } from '@playwright/test'

import { ALL_PAGES } from './constants'

const test = playwrightTest.extend<{ navigation: Locator }>({
  navigation: async ({ page }, use) => {
    await use(page.getByRole('navigation', { name: 'Menu' }))
  },
})

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })
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

    test.describe('secondary', () => {
      const rootPages = ALL_PAGES.filter((page) => (
        page.isRoot && typeof page.tag === 'string'
      ))

      test.describe('dropdown sections', () => {
        rootPages.forEach(({ title, url }) => {
          test.describe(url, () => {
            test.describe('initially open', () => {
              test.beforeEach(async ({ page }) => {
                await page.goto(url)
                await page.getByRole('button', { name: 'Menu' }).click()
              })
              test('sub nav is open by default', async ({ navigation }) => {
                await expect(navigation.getByRole('list', { name: title })).toBeVisible()
                await expect(navigation.getByRole('button', { name: title })).toHaveAttribute('aria-expanded', 'true')
              })
              test('pressing the section closes the nav', async ({ navigation }) => {
                await navigation.getByRole('button', { name: title }).click()
                await expect(navigation.getByRole('list', { name: title })).toBeHidden()
                await expect(navigation.getByRole('button', { name: title })).toHaveAttribute('aria-expanded', 'false')
              })
            })

            test.describe('initially closed', () => {
              test.beforeEach(async ({ page }) => {
                await page.goto('/')
                await page.getByRole('button', { name: 'Menu' }).click()
              })
              test('sub nav is closed by default', async ({ navigation }) => {
                await expect(navigation.getByRole('list', { name: title })).toBeHidden()
                await expect(navigation.getByRole('button', { name: title })).toHaveAttribute('aria-expanded', 'false')
              })
              test('pressing the section opens the nav', async ({ navigation }) => {
                await navigation.getByRole('button', { name: title }).click()
                await expect(navigation.getByRole('list', { name: title })).toBeVisible()
                await expect(navigation.getByRole('button', { name: title })).toHaveAttribute('aria-expanded', 'true')
              })
            })
          })
        })
      })
    })

    test.describe('when JavaScript is disabled', () => {
      test.use({ javaScriptEnabled: false })
      test('top level navigation is shown', async ({ navigation }) => {
        await expect(navigation.getByRole('button')).toHaveCount(0)
        await expect(navigation.getByRole('link')).toHaveCount(ALL_PAGES.filter((data) => data.isRoot).length)
      })
    })

    test.describe('@visual-regression', () => {
      test('matches the saved screenshot', async ({ page }) => {
        await page.getByRole('button', { name: 'Menu' }).click()
        await expect(page.getByRole('document')).toHaveScreenshot(
          'mobile-menu-expanded-screenshot.png',
        )
      })

      test.describe('when JavaScript is disabled', () => {
        test.use({ javaScriptEnabled: false })

        test('matches the saved screenshot', async ({ page }) => {
          await expect(page.getByRole('document')).toHaveScreenshot(
            'mobile-menu-expanded-screenshot-js-disabled.png',
          )
        })
      })
    })
  })
})
