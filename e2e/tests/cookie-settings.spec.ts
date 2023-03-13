import { expect, test } from '@playwright/test'
import { findLast } from 'lodash'
import { cookiePreferenceKey, googleTagId } from '../../src/lib/cookieSettings'

const gaSessionCookie = `_ga_${googleTagId.replace(/^G-/, '')}`

function transformCookieToObject(cookieString: string) {
  return Object.fromEntries(
    cookieString.split('; ').map((cookie) => cookie.split('=')),
  )
}

const testOptions = () => {
  test.describe('selecting yes', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('radio', { name: 'Yes' }).click()
      await page.getByRole('button', { name: 'Save cookie settings' }).click()
    })

    test('show the notification banner', async ({ page }) => {
      await expect(page.getByRole('alert')).toContainText('Your cookie settings were saved')
      await expect(page.getByRole('alert')).toBeFocused()
    })

    test('cookie preference is set to the correct value', async ({ browserName, page }) => {
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

  test.describe('selecting no', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('radio', { name: 'No' }).click()
      await page.getByRole('button', { name: 'Save cookie settings' }).click()
    })

    test('show the notification banner', async ({ page }) => {
      await expect(page.getByRole('alert')).toContainText('Your cookie settings were saved')
      await expect(page.getByRole('alert')).toBeFocused()
    })

    test('cookie preference is set to the correct value', async ({ browserName, page }) => {
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
        findLast(
          await page.evaluate(() => window.dataLayer),
          (data) => data['0'] === 'consent' && data['1'] === 'update',
        ),
      )
        .toEqual({
          0: 'consent',
          1: 'update',
          2: { analytics_storage: 'denied' },
        })
    })
  })
}

test.describe('cookie setting', () => {
  // Remove cookies for these tests
  test.use({ storageState: { cookies: [], origins: [] } })
  test.describe('no cookie preference set', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/cookies/')
    })
    test('radio option No is checked by default', async ({ page }) => {
      await expect(page.getByRole('radio', { name: 'Yes' })).not.toBeChecked()
      await expect(page.getByRole('radio', { name: 'No' })).toBeChecked()
    })

    test('cookie banner is hidden on the cookies page', async ({ page }) => {
      await expect(page.getByRole('region', { name: 'Cookies on the MOD.UK Design System' })).toBeHidden()
    })

    testOptions()
  })

  test.describe('design-system-cookie-preference is set to 0', () => {
    test.beforeEach(async ({ context, page }) => {
      await context.addCookies([{
        name: cookiePreferenceKey,
        value: '0',
        expires: Date.now() / 1000 + 1000 * 60 * 60,
        domain: 'localhost',
        path: '/',
      }])
      await page.goto('/cookies/')
    })
    test('radio option No is checked by default', async ({ page }) => {
      await expect(page.getByRole('radio', { name: 'Yes' })).not.toBeChecked()
      await expect(page.getByRole('radio', { name: 'No' })).toBeChecked()
    })

    testOptions()
  })

  test.describe('design-system-cookie-preference is set to 1', () => {
    test.beforeEach(async ({ context, page }) => {
      await context.addCookies([{
        name: cookiePreferenceKey,
        value: '1',
        expires: Date.now() / 1000 + 1000 * 60 * 60,
        domain: 'localhost',
        path: '/',
      }])
      await page.goto('/cookies/')
    })
    test('radio option Yes is checked by default', async ({ page }) => {
      await expect(page.getByRole('radio', { name: 'Yes' })).toBeChecked()
      await expect(page.getByRole('radio', { name: 'No' })).not.toBeChecked()
    })

    testOptions()
  })

  test.describe('javaScript disabled', () => {
    test.use({ javaScriptEnabled: false })
    test.beforeEach(async ({ page }) => {
      await page.goto('/cookies/')
    })

    test('the cookie setting form is not displayed', async ({ page }) => {
      await expect(page.getByRole('form')).toBeHidden()
    })

    test.describe('@visual-regression', () => {
      test('matches the saved screenshot', async ({ page }) => {
        await expect(page.getByRole('document')).toHaveScreenshot(
          'cookie-banner-js-disabled.png',
        )
      })
    })
  })

  test.describe('@visual-regression', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/cookies/')
    })
    test('notification banner matches the saved screenshot', async ({ page }) => {
      await page.getByRole('button', { name: 'Save cookie settings' }).click()
      await expect(page).toHaveScreenshot(
        'cookie-banner-notification.png',
      )
    })
  })
})
