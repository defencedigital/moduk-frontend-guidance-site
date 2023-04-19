import { expect, Locator, test as base } from '@playwright/test'

const test = base.extend<{
  backToTopLink: Locator
  scrollDownOnePage: () => Promise<void>
  scrollToEnd: () => Promise<void>
}>({
  backToTopLink: async ({ page }, use) => {
    await use(page.getByRole('link', { name: 'Back to top' }))
  },
  scrollDownOnePage: async ({ page }, use) => {
    await use(() => page.evaluate(() => window.scrollBy(0, window.innerHeight)))
  },
  scrollToEnd: async ({ page }, use) => {
    await use(() => page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)))
  },
})

test.describe('back to top link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/get-started/setup-guide-for-developers/')
  })

  test('does not show the link initially', async ({ backToTopLink }) => {
    await expect(backToTopLink).not.toBeInViewport()
  })

  test('shows the link after paging down on @tablet-and-desktop', async ({ backToTopLink, scrollDownOnePage }) => {
    await scrollDownOnePage()
    await expect(backToTopLink).toBeInViewport()
  })

  test('does not show the link after paging down on @mobile', async ({ backToTopLink, scrollDownOnePage }) => {
    await scrollDownOnePage()
    await expect(backToTopLink).not.toBeInViewport()
  })

  test('shows the link after scrolling to the end', async ({ backToTopLink, scrollToEnd }) => {
    await scrollToEnd()
    await expect(backToTopLink).toBeInViewport()
  })

  test.describe('@visual-regression @tablet-and-desktop', () => {
    test('matches the saved screenshot after paging down', async ({ page, scrollDownOnePage }) => {
      await scrollDownOnePage()
      await expect(page).toHaveScreenshot('viewport-page-down.png')
    })

    test('matches the saved screenshot after scrolling to the end', async ({ page, scrollToEnd }) => {
      await scrollToEnd()
      await expect(page).toHaveScreenshot('viewport-bottom-of-page.png')
    })
  })
})
