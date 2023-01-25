import { expect, test as base } from '@playwright/test'

const test = base.extend({
  tabRole: ({ viewport }, use) => {
    use(viewport && viewport.width < 641 ? 'button' : 'tab')
  },
})

test.describe('code snippet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/back-link/')
  })

  test.describe('@visual-regression', () => {
    test.beforeEach(async ({ page, tabRole }) => {
      await page.getByRole(tabRole, { name: 'HTML' }).click()
    })

    test('the outer box matches the screenshot on focus', async ({ page }) => {
      const codeSnippet = page.getByRole('tabpanel').locator('.guidance-code-snippet')
      await codeSnippet.locator('pre').focus()

      await expect(codeSnippet).toHaveScreenshot('copy-snippet-box-focus.png')
    })

    test('the copy button matches the screenshot on focus', async ({ browserName, page }) => {
      // https://github.com/microsoft/playwright/issues/18901
      test.skip(browserName === 'webkit', 'WebKit does not support navigator.clipboard on Linux')

      const codeSnippet = page.getByRole('tabpanel').locator('.guidance-code-snippet')
      const copyButton = codeSnippet.getByRole('button', { name: 'Copy code' })
      await copyButton.focus()

      await expect(codeSnippet).toHaveScreenshot('copy-button-focus.png')
    })
  })
})
