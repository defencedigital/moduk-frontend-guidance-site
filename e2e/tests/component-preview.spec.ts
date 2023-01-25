import { expect, test as base } from '@playwright/test'

const test = base.extend({
  tabRole: ({ viewport }, use) => {
    use(viewport && viewport.width < 641 ? 'button' : 'tab')
  },
})

test.describe('component preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/back-link/')
  })

  test('hides the tab contents on load', async ({ page, tabRole }) => {
    await expect(page.getByRole('tabpanel')).toHaveCount(0)
    await expect(page.getByRole(tabRole, { name: 'HTML' })).toHaveAttribute('aria-expanded', 'false')
    await expect(page.getByRole(tabRole, { name: 'Nunjucks' })).toHaveAttribute('aria-expanded', 'false')
  })

  test.describe('when the HTML tab is clicked', () => {
    test.beforeEach(async ({ page, tabRole }) => {
      await page.getByRole(tabRole, { name: 'HTML' }).click()
    })

    test('shows the HTML tab contents', async ({ page, tabRole }) => {
      await expect(page.getByRole('tabpanel')).toContainText('<a href')
      await expect(page.getByRole(tabRole, { name: 'HTML' })).toHaveAttribute('aria-expanded', 'true')
      await expect(page.getByRole(tabRole, { name: 'Nunjucks' })).toHaveAttribute('aria-expanded', 'false')
    })

    test('switches to the Nunjucks tab contents when that tab is clicked', async ({ page, tabRole }) => {
      await page.getByRole(tabRole, { name: 'Nunjucks' }).click()

      await expect(page.getByRole('tabpanel')).toContainText('{{ modukBackLink({')
      await expect(page.getByRole(tabRole, { name: 'Nunjucks' })).toHaveAttribute('aria-expanded', 'true')
      await expect(page.getByRole(tabRole, { name: 'HTML' })).toHaveAttribute('aria-expanded', 'false')
    })

    test.describe('@visual-regression', () => {
      const TABS = ['HTML', 'Nunjucks']

      TABS.forEach((tabName) => {
        test(`matches the saved screenshot when the ${tabName} tab is not hovered`, async ({ page }) => {
          await page.mouse.move(0, 0)
          const componentPreview = page.locator('.guidance-component-preview')
          await expect(componentPreview).toHaveScreenshot(
            `component-preview-${tabName.toLowerCase()}-tab-unhovered.png`,
          )
        })

        test(`matches the saved screenshot when the ${tabName} tab is hovered`, async ({ page, tabRole }) => {
          await page.getByRole(tabRole, { name: tabName }).hover()
          const componentPreview = page.locator('.guidance-component-preview')
          await expect(componentPreview).toHaveScreenshot(`component-preview-${tabName.toLowerCase()}-tab-hovered.png`)
        })

        test(`matches the saved screenshot when the ${tabName} tab is focused`, async ({ page, tabRole }) => {
          await page.mouse.move(0, 0)
          await page.getByRole(tabRole, { name: tabName }).focus()
          const componentPreview = page.locator('.guidance-component-preview')
          await expect(componentPreview).toHaveScreenshot(`component-preview-${tabName.toLowerCase()}-tab-focused.png`)
        })
      })
    })
  })

  test.describe('when the Nunjucks tab is clicked', () => {
    test.beforeEach(async ({ page, tabRole }) => {
      await page.getByRole(tabRole, { name: 'Nunjucks' }).click()
    })

    test('shows the Nunjucks tab contents', async ({ page, tabRole }) => {
      await expect(page.getByRole('tabpanel')).toContainText('{{ modukBackLink({')
      await expect(page.getByRole(tabRole, { name: 'Nunjucks' })).toHaveAttribute('aria-expanded', 'true')
      await expect(page.getByRole(tabRole, { name: 'HTML' })).toHaveAttribute('aria-expanded', 'false')
    })

    test('switches to the HTML tab contents when that tab is clicked', async ({ page, tabRole }) => {
      await page.getByRole(tabRole, { name: 'HTML' }).click()

      await expect(page.getByRole('tabpanel')).toContainText('<a href')
      await expect(page.getByRole(tabRole, { name: 'HTML' })).toHaveAttribute('aria-expanded', 'true')
      await expect(page.getByRole(tabRole, { name: 'Nunjucks' })).toHaveAttribute('aria-expanded', 'false')
    })
  })

  test.describe('when JavaScript is disabled', () => {
    test.use({ javaScriptEnabled: false })

    test('shows the tab contents on load', async ({ page }) => {
      await expect(page.getByRole('tabpanel')).toHaveCount(2)
    })
  })
})
