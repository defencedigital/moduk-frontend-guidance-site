import { expect, test } from '@playwright/test'

test.describe('cookie banner', () => {
  // Remove cookies for these tests
  test.use({ storageState: { cookies: [], origins: [] } })
  test.describe('prompt for cookie preferences', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/?cookie_prompt_enabled')
    })

    test('the cookie banner is displayed', async ({ page }) => {
      const cookieBanner = page.getByRole('region', { name: 'Cookies on the MOD.UK Design System' })
      await expect(cookieBanner.getByRole('button', { name: 'Accept analytics cookies' })).toBeVisible()
      await expect(cookieBanner.getByRole('button', { name: 'Reject analytics cookies' })).toBeVisible()
      await expect(cookieBanner.getByRole('link', { name: 'View cookies' })).toBeVisible()
    })

    test('passes accessibility checks', async ({ page }) => {
      await expect(page).toHaveNoViolations()
    })

    test.describe('selecting a cookie preference', () => {
      const testCases = [{
        buttonText: 'Accept analytics cookies',
        expectedCookieValue: '1',
        expectedConfirmationMsg: 'You’ve accepted analytics cookies.',
      }, {
        buttonText: 'Reject analytics cookies',
        expectedCookieValue: '0',
        expectedConfirmationMsg: 'You’ve rejected analytics cookies.',
      }]

      testCases.forEach(({ buttonText, expectedCookieValue, expectedConfirmationMsg }) => {
        test(buttonText.toLowerCase(), async ({ page, browserName }) => {
          test.skip(browserName === 'webkit', 'WebKit does not let you set Secure cookies on localhost')
          const cookieBanner = page.getByRole('region', { name: 'Cookies on the MOD.UK Design System' })
          await cookieBanner.getByRole('button', { name: buttonText }).click()

          await expect(page.getByText(expectedConfirmationMsg)).toBeVisible()

          await cookieBanner.getByRole('button', { name: 'Hide cookie message' }).click()

          await expect(cookieBanner).toBeHidden()

          const cookie = await page.evaluate(() => document.cookie)
          expect(cookie).toMatch(`design-system-cookie-preference=${expectedCookieValue}`)
        })
      })
    })

    test.describe('@visual-regression', () => {
      test('matches the saved screenshot', async ({ page }) => {
        await expect(page.getByRole('document')).toHaveScreenshot(
          'cookie-banner.png',
        )
      })
    })
  })

  test.describe('cookie preferences has been set', () => {
    const testCases = ['1', '0']
    testCases.forEach((value) => {
      test(`cookie banner does not show when design-system-cookie-preference is set to ${value}`, async ({ page, context, browserName }) => {
        test.skip(browserName === 'webkit', 'WebKit does not let you set Secure cookies on localhost')
        await context.addCookies([{
          name: 'design-system-cookie-preference',
          value,
          expires: Date.now() / 1000 + 1000 * 60 * 60,
          domain: 'localhost',
          path: '/',
        }])

        await page.goto('/?cookie_prompt_enabled')
        await expect(page.getByRole('region', { name: 'Cookies on the MOD.UK Design System' })).toBeHidden()

        const cookie = await page.evaluate(() => document.cookie)
        expect(cookie).toMatch(`design-system-cookie-preference=${value}`)
      })
    })
  })

  test.describe('javaScript disabled', () => {
    test.use({ javaScriptEnabled: false })
    test.beforeEach(async ({ page }) => {
      await page.goto('/?cookie_prompt_enabled')
    })

    test('the cookie banner is not displayed', async ({ page }) => {
      const cookieBanner = page.getByRole('region', { name: 'Cookies on the MOD.UK Design System' })
      await expect(cookieBanner).toBeHidden()
    })

    test.describe('@visual-regression', () => {
      test('matches the saved screenshot', async ({ page }) => {
        await expect(page.getByRole('document')).toHaveScreenshot(
          'cookie-banner-js-disabled.png',
        )
      })
    })
  })
})
