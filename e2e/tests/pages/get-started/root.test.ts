import { expect, test } from '@playwright/test'

test.describe('/get-started/', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/get-started/')
  })

  test('has the correct title tag', async ({ page }) => {
    await expect(page).toHaveTitle('Get started – MOD.UK Design System')
  })

  test('has the correct level 1 heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Get started')
  })

  test.describe('@tablet-and-desktop', () => {
    test('has the expected side nav links', async ({ page }) => {
      const links = page.locator('nav.guidance-side-nav').getByRole('link')
      await expect(links).toHaveCount(4)
      await expect(links.nth(0)).toHaveAttribute('href', '/get-started/setup-guide-for-developers/')
      await expect(links.nth(1)).toHaveAttribute('href', '/get-started/use-nunjucks/')
      await expect(links.nth(2)).toHaveAttribute('href', '/get-started/silence-deprecation-warnings-in-dart-sass/')
      await expect(links.nth(3)).toHaveAttribute('href', '/get-started/change-the-image-assets-path/')
    })

    test.describe('@visual-regression', () => {
      test('the first side nav link matches the saved screenshot on hover', async ({ page }) => {
        const setupGuideLink = page.locator('nav.guidance-side-nav').getByText('Setup guide for developers')
        await setupGuideLink.hover()
        await expect(setupGuideLink).toHaveScreenshot('side-nav-link-hover.png')
      })

      test('the first side nav link matches the saved screenshot on focus', async ({ page }) => {
        const setupGuideLink = page.locator('nav.guidance-side-nav').getByText('Setup guide for developers')
        await setupGuideLink.focus()
        await expect(setupGuideLink).toHaveScreenshot('side-nav-link-focus.png')
      })
    })
  })
})
