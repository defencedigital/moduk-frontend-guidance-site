import { expect, Locator, test as base } from '@playwright/test'
import { Role } from './role'

const test = base.extend<
  { tabRole: Role['role']; firstComponentPreview: Locator; clickFirstNunjucksTab: () => Promise<void> }
>({
  tabRole: ({ viewport }, use) => {
    use(viewport && viewport.width < 641 ? 'button' : 'tab')
  },
  firstComponentPreview: ({ page }, use) => {
    use(page.locator('.guidance-component-preview').first())
  },
  clickFirstNunjucksTab: ({ firstComponentPreview, page, tabRole }, use) => {
    use(async () => {
      await firstComponentPreview.getByRole(tabRole, { name: 'Nunjucks' }).click()
      await firstComponentPreview.getByText('Nunjucks macro options').click()
      await page.mouse.move(0, 0)
    })
  },
})

// The JavaScript is disabled in some of these tests as the iframe
// resizer causes instability when taking mobile screenshots
test.use({ javaScriptEnabled: false })

test.describe('macro options', () => {
  test.describe('with link to another component', () => {
    test.beforeEach(async ({ clickFirstNunjucksTab, page }) => {
      await page.goto('/components/phase-banner/')
      await clickFirstNunjucksTab()
    })

    test('links to the tag component', async ({ firstComponentPreview }) => {
      const tagLink = firstComponentPreview.getByRole('link', { name: 'tag' })
      await expect(tagLink).toHaveAttribute('href', '/components/tag/#options--tag--default--details')
    })

    test.describe('@visual-regression', () => {
      test('matches the saved screenshot', async ({ page }) => {
        const details = page.locator('details', { hasText: 'Nunjucks macro options' }).first()
        await expect(details).toHaveScreenshot(
          'phase-banner.png',
          { scale: 'css' },
        )
      })
    })
  })

  test.describe('with link to another component containing a space', () => {
    test.beforeEach(async ({ clickFirstNunjucksTab, page }) => {
      await page.goto('/components/textarea/')
      await clickFirstNunjucksTab()
    })

    test('links to the error message component', async ({ firstComponentPreview }) => {
      await expect(firstComponentPreview.getByRole('link', { name: 'error message' })).toHaveAttribute(
        'href',
        '/components/error-message/#options--error-message--default--details',
      )
    })

    test.describe('@visual-regression', () => {
      test('matches the saved screenshot', async ({ page }) => {
        const details = page.locator('details', { hasText: 'Nunjucks macro options' }).first()
        await expect(details).toHaveScreenshot(
          'textarea.png',
          { scale: 'css' },
        )
      })
    })
  })

  test.describe('when navigating from a link in another component', () => {
    test.use({ javaScriptEnabled: true })

    test.beforeEach(async ({ page }) => {
      await page.goto('/components/error-message/#options--error-message--default--details')
    })

    test('focuses the summary element', async ({ firstComponentPreview }) => {
      const summary = firstComponentPreview.locator('summary', { hasText: 'Nunjucks macro options' })
      await expect(summary).toBeFocused()
    })

    test.describe('@visual-regression', () => {
      test('matches the saved screenshot', async ({ firstComponentPreview }) => {
        const details = firstComponentPreview.locator('details', { hasText: 'Nunjucks macro options' })
        await expect(details).toHaveScreenshot(
          'error-message-deep-link.png',
          { scale: 'css' },
        )
      })
    })
  })

  test.describe('with nested options', () => {
    test.beforeEach(async ({ clickFirstNunjucksTab, page }) => {
      await page.goto('/components/accordion/')
      await clickFirstNunjucksTab()
    })

    test('links to the items section', async ({ firstComponentPreview }) => {
      await expect(firstComponentPreview.getByRole('link', { name: 'items' })).toHaveAttribute(
        'href',
        '#options--accordion--default--items',
      )
    })

    test.describe('@visual-regression', () => {
      test('matches the saved screenshot', async ({ firstComponentPreview }) => {
        const details = firstComponentPreview.locator('details', { hasText: 'Nunjucks macro options' })
        await expect(details).toHaveScreenshot(
          'accordion.png',
          { scale: 'css' },
        )
      })
    })
  })

  test.describe('with internal components', () => {
    test.beforeEach(async ({ clickFirstNunjucksTab, page }) => {
      await page.goto('/components/text-input/')
      await clickFirstNunjucksTab()
    })

    test('links to the hint section', async ({ firstComponentPreview }) => {
      await expect(firstComponentPreview.getByRole('link', { name: 'hint' })).toHaveAttribute(
        'href',
        '#options--input--default--hint',
      )
    })

    test.describe('@visual-regression', () => {
      test('matches the saved screenshot', async ({ firstComponentPreview }) => {
        const details = firstComponentPreview.locator('details', { hasText: 'Nunjucks macro options' })
        await expect(details).toHaveScreenshot(
          'text-input.png',
          { scale: 'css', timeout: 10_000 },
        )
      })
    })
  })
})
