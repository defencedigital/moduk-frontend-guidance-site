import { cookiePreferenceKey } from '../../../../lib/cookieSettings'
import { analyticsSetting } from './analytics'
import { getCookie, setCookie } from './cookie'

export function initCookieSettingPage() {
  const form = document.querySelector<HTMLFormElement>('.js-cookie-setting-form')
  const radioYes = form?.querySelector<HTMLInputElement>('#analytics-cookies-yes')
  const radioNo = form?.querySelector<HTMLInputElement>('#analytics-cookies-no')
  const notificationBanner = document.querySelector<HTMLDivElement>('.js-cookie-notification-banner')

  if (!form || !radioYes || !radioNo || !notificationBanner) {
    return
  }

  const cookiePreference = getCookie(cookiePreferenceKey)

  const radio = cookiePreference === '1' ? radioYes : radioNo

  radio.checked = true

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const preference = radioYes.checked ? '1' : '0'

    setCookie(cookiePreferenceKey, preference, 365)
    analyticsSetting(preference === '1')

    notificationBanner.removeAttribute('hidden')

    if (!notificationBanner.getAttribute('tabindex')) {
      notificationBanner.setAttribute('tabindex', '-1')
    }

    notificationBanner.focus()
    window.scrollTo(0, 0)
  })

  form.removeAttribute('hidden')
}
