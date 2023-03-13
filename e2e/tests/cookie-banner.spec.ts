import { expect, Locator, test as base } from '@playwright/test'
import { cookiePreferenceKey, googleTagId } from '../../src/lib/cookieSettings'

const gaSessionCookie = `_ga_${googleTagId.replace(/^G-/, '')}`

function transformCookieToObject(cookieString: string) {
  return Object.fromEntries(
    cookieString.split('; ').map((cookie) => cookie.split('=')),
  )
}
const test = base.extend<{ cookieBanner: Locator }>({
  cookieBanner: async ({ page }, use) => {
    const cookieBanner = page.getByRole('region', { name: 'Cookies on the MOD.UK Design System' })
    await use(cookieBanner)
  },
})

test.describe('cookie banner', () => {
  // Remove cookies for these tests
  test.use({ storageState: { cookies: [], origins: [] } })

  test.describe('prompt for cookie preferences', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
    })

    test('the cookie banner is displayed', async ({ cookieBanner }) => {
      await expect(cookieBanner.getByRole('button', { name: 'Accept analytics cookies' })).toBeVisible()
      await expect(cookieBanner.getByRole('button', { name: 'Reject analytics cookies' })).toBeVisible()
      await expect(cookieBanner.getByRole('link', { name: 'View cookies' })).toBeVisible()
    })

    test('passes accessibility checks', async ({ page }) => {
      await expect(page).toHaveNoViolations()
    })

    test.describe('accept analytics cookies', () => {
      test.beforeEach(async ({ cookieBanner }) => {
        await cookieBanner.getByRole('button', { name: 'Accept analytics cookies' }).click()
      })

      test('show the correct message', async ({ cookieBanner, page }) => {
        await expect(page.getByText('You’ve accepted analytics cookies.')).toBeVisible()
        await cookieBanner.getByRole('button', { name: 'Hide cookie message' }).click()
        await expect(cookieBanner).toBeHidden()
      })

      test('set the cookie preference to the correct value', async ({ browserName, page }) => {
        test.skip(browserName === 'webkit', 'WebKit does not let you set Secure cookies on localhost')
        // @ts-expect-error See https://github.com/microsoft/playwright/issues/21453
        expect(await page.evaluate(() => document.cookie)).toMatch(`${cookiePreferenceKey}=1`)
      })

      test('analytics cookies are installed', async ({ browserName, page }) => {
        test.skip(browserName === 'webkit', 'WebKit does not let you set Secure cookies on localhost')

        const cookies = await page.evaluate(() => document.cookie)
        const cookieValues = Object.keys(transformCookieToObject(cookies))
        expect(cookieValues).toContain('_ga')
        expect(cookieValues).toContain(gaSessionCookie)
      })
    })

    test.describe('reject analytics cookies', () => {
      test.beforeEach(async ({ cookieBanner }) => {
        await cookieBanner.getByRole('button', { name: 'Reject analytics cookies' }).click()
      })

      test('show the correct message', async ({ cookieBanner, page }) => {
        await expect(page.getByText('You’ve rejected analytics cookies.')).toBeVisible()
        await cookieBanner.getByRole('button', { name: 'Hide cookie message' }).click()
        await expect(cookieBanner).toBeHidden()
      })

      test('set the cookie preference to the correct value', async ({ browserName, page }) => {
        test.skip(browserName === 'webkit', 'WebKit does not let you set Secure cookies on localhost')
        // @ts-expect-error See https://github.com/microsoft/playwright/issues/21453
        expect(await page.evaluate(() => document.cookie)).toMatch(`${cookiePreferenceKey}=0`)
      })

      test('analytics cookies are not installed', async ({ browserName, page }) => {
        test.skip(browserName === 'webkit', 'WebKit does not let you set Secure cookies on localhost')

        const cookies = await page.evaluate(() => document.cookie)
        const cookieValues = Object.keys(transformCookieToObject(cookies))

        expect(cookieValues).toContain(cookiePreferenceKey)
        expect(cookieValues).toHaveLength(1)

        expect(
          await page.evaluate(() => window.dataLayer.find((data) => data['0'] === 'consent' && data['1'] === 'update')),
        )
          .toEqual({
            0: 'consent',
            1: 'update',
            2: { analytics_storage: 'denied' },
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

  test.describe('cookie preferences has been previously set', () => {
    test.describe('cookie preference is set to 1', () => {
      test.beforeEach(async ({ context, page }) => {
        await context.addCookies([{
          name: cookiePreferenceKey,
          value: '1',
          expires: Date.now() / 1000 + 1000 * 60 * 60,
          domain: 'localhost',
          path: '/',
        }])
        await page.goto('/')
      })

      test('banner is hidden', async ({ page }) => {
        await expect(page.getByRole('region', { name: 'Cookies on the MOD.UK Design System' })).toBeHidden()
      })

      test('analytics cookies are installed', async ({ browserName, page }) => {
        test.skip(browserName === 'webkit', 'WebKit does not let you set Secure cookies on localhost')
        const cookies = await page.evaluate(() => document.cookie)
        const cookieValues = Object.keys(transformCookieToObject(cookies))
        expect(cookieValues).toContain('_ga')
        expect(cookieValues).toContain(gaSessionCookie)
        expect(
          await page.evaluate(() => window.dataLayer.find((data) => data['0'] === 'consent' && data['1'] === 'update')),
        )
          .toEqual({
            0: 'consent',
            1: 'update',
            2: { analytics_storage: 'granted' },
          })
      })
    })

    test.describe('cookie preference is set to 0', () => {
      test.beforeEach(async ({ context, page }) => {
        await context.addCookies([{
          name: cookiePreferenceKey,
          value: '0',
          expires: Date.now() / 1000 + 1000 * 60 * 60,
          domain: 'localhost',
          path: '/',
        }])
        await page.goto('/')
      })

      test('banner is hidden', async ({ page }) => {
        await expect(page.getByRole('region', { name: 'Cookies on the MOD.UK Design System' })).toBeHidden()
      })

      test('analytics cookies are not installed', async ({ browserName, page }) => {
        test.skip(browserName === 'webkit', 'WebKit does not let you set Secure cookies on localhost')

        expect(
          await page.evaluate(() => window.dataLayer.find((data) => data['0'] === 'consent' && data['1'] === 'update')),
        )
          .toEqual({
            0: 'consent',
            1: 'update',
            2: { analytics_storage: 'denied' },
          })
      })
    })
  })

  test.describe('cookie preferences expires', () => {
    test('consent is set to deny and cookies are removed', async ({ context, page, browserName }) => {
      test.skip(browserName === 'webkit', 'WebKit does not let you set Secure cookies on localhost')
      await context.addCookies([{
        name: '_ga',
        value: '1',
        expires: Date.now() / 1000 + 1000 * 60 * 60,
        domain: 'localhost',
        path: '/',
      }, {
        name: gaSessionCookie,
        value: '1',
        expires: Date.now() / 1000 + 1000 * 60 * 60,
        domain: 'localhost',
        path: '/',
      }])

      await page.goto('/')

      expect(
        await page.evaluate(() => window.dataLayer.find((data) => data['0'] === 'consent' && data['1'] === 'default')),
      )
        .toEqual({
          0: 'consent',
          1: 'default',
          2: { analytics_storage: 'denied' },
        })

      expect(await page.evaluate(() => document.cookie)).toEqual('')
    })
  })

  test.describe('javaScript disabled', () => {
    test.use({ javaScriptEnabled: false })
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
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
