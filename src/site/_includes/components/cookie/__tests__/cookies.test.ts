import { getByRole } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initCookieBanner } from '..'
import * as analytics from '../analytics'
import { deleteCookie } from '../cookie'

const html = `
<div class="js-cookie-guidance-banner--container">
  <div hidden class="js-cookie-guidance-banner--permission">
      <button value="accept">Accept</button>
      <button value="reject">Reject</button>
  </div>
  <div hidden class="js-cookie-guidance-banner--accept"></div>
  <div hidden class="js-cookie-guidance-banner--reject"></div>
<div>
`

describe('initCookieBanner', () => {
  beforeEach(() => {
    window.location.href = 'https://localhost?cookie_prompt_enabled'
    document.body.innerHTML = html
  })
  afterEach(() => {
    document.cookie = 'design-system-cookie-preference=unset;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
  })

  it('Accept button calls analyticSetting with true', async () => {
    const analyticsSettingSpy = vi.spyOn(analytics, 'analyticsSetting')
    initCookieBanner()
    await userEvent.click(getByRole(document.body, 'button', { name: 'Accept' }))
    expect(analyticsSettingSpy).toHaveBeenCalledWith(true)
    expect(analyticsSettingSpy).toHaveBeenCalledOnce()
    deleteCookie('design-system-cookie-preference')
  })

  it('Reject button calls analyticSetting with false', async () => {
    const analyticsSettingSpy = vi.spyOn(analytics, 'analyticsSetting')
    initCookieBanner()
    await userEvent.click(getByRole(document.body, 'button', { name: 'Reject' }))
    expect(analyticsSettingSpy).toHaveBeenCalledWith(false)
    expect(analyticsSettingSpy).toHaveBeenCalledOnce()
  })

  it('Remove cookies when the banner is shown', () => {
    const analyticsSettingSpy = vi.spyOn(analytics, 'analyticsSetting')
    const removeAnalyticCookiesSpy = vi.spyOn(analytics, 'removeAnalyticCookies')
    initCookieBanner()
    expect(analyticsSettingSpy).not.toBeCalled()
    expect(removeAnalyticCookiesSpy).toBeCalled()
  })
})
