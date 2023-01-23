import { expect, test } from '@playwright/test'

test.describe('/components/back-link/', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/back-link/')
  })

  test('has the correct title tag', async ({ page }) => {
    await expect(page).toHaveTitle('Back link – MOD.UK Design System')
  })

  test.describe('code snippet', () => {
    test.describe('@visual-regression', () => {
      test('the outer box matches the screenshot on focus', async ({ page }) => {
        const codeSnippet = page.locator('.guidance-code-snippet').first()
        await codeSnippet.locator('pre').focus()

        await expect(codeSnippet).toHaveScreenshot('copy-snippet-box-focus.png')
      })

      test('the copy button matches the screenshot on focus', async ({ browserName, page }) => {
        // https://github.com/microsoft/playwright/issues/18901
        test.skip(browserName === 'webkit', 'WebKit does not support navigator.clipboard on Linux')

        const codeSnippet = page.locator('.guidance-code-snippet').first()
        const copyButton = codeSnippet.getByRole('button', { name: 'Copy code' })
        await copyButton.focus()

        await expect(codeSnippet).toHaveScreenshot('copy-button-focus.png')
      })
    })
  })
})
