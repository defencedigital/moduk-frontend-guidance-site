import { fireEvent, getByRole } from '@testing-library/dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cookiePreferenceKey } from '../../../../../lib/cookieSettings'
import { initCookieSettingPage } from '..'
import * as analytics from '../analytics'
import { deleteCookie, setCookie } from '../cookie'

const html = `
<div class="js-cookie-notification-banner" hidden>Success</div>
<form  class="js-cookie-setting-form" name="cookie-settings">
  <label for="analytics-cookies-yes">Yes</label>
  <input type="radio" id="analytics-cookies-yes" name="analytics-cookies" value="1" />
  <label for="analytics-cookies-no">No</label>
  <input type="radio" id="analytics-cookies-no" name="analytics-cookies" value="0" />
  <button type="submit">Submit</button>
</form>
`

vi.mock('../cookie')

describe('initCookieSettingForm', () => {
  beforeEach(() => {
    document.body.innerHTML = html
    window.googleTagId = 'G-1234'
  })

  afterEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  it('submitting yes calls analyticSetting with true', async () => {
    const analyticsSettingSpy = vi.spyOn(analytics, 'analyticsSetting')
    initCookieSettingPage()

    getByRole<HTMLInputElement>(document.body, 'radio', { name: 'Yes' }).checked = true
    // workaround for happy-dom issue https://github.com/capricorn86/happy-dom/issues/527
    fireEvent(getByRole(document.body, 'form'), new Event('submit', { bubbles: true }))

    expect(analyticsSettingSpy).toHaveBeenCalledWith(true)
    expect(setCookie).toHaveBeenCalledWith(cookiePreferenceKey, '1', 365)
  })

  it('submitting no calls analyticSetting with false and removes the cookies', async () => {
    const analyticsSettingSpy = vi.spyOn(analytics, 'analyticsSetting')
    initCookieSettingPage()

    getByRole<HTMLInputElement>(document.body, 'radio', { name: 'No' }).checked = true
    fireEvent(getByRole(document.body, 'form'), new Event('submit', { bubbles: true }))

    expect(analyticsSettingSpy).toHaveBeenCalledWith(false)
    expect(setCookie).toHaveBeenCalledWith(cookiePreferenceKey, '0', 365)
    expect(deleteCookie).toHaveBeenNthCalledWith(1, '_ga')
    expect(deleteCookie).toHaveBeenNthCalledWith(2, '_ga_1234')
  })
})
