import { expect, Locator, test as base } from '@playwright/test'
import { Role } from './role'

const test = base.extend<
  { tabRole: Role['role']; firstComponentPreview: Locator; clickFirstNunjucksTab: () => Promise<void> }
>({
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

    test('the copy button matches the screenshot on focus', async ({ page }) => {
      const codeSnippet = page.getByRole('tabpanel').locator('.guidance-code-snippet')
      const copyButton = codeSnippet.getByRole('button', { name: 'Copy code' })
      await copyButton.focus()

      await expect(codeSnippet).toHaveScreenshot('copy-button-focus.png')
    })
  })
})
