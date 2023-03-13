import { cookiePreferenceKey } from '../../../../lib/cookieSettings'
import { analyticsSetting, removeAnalyticCookies } from './analytics'
import { getCookie, setCookie } from './cookie'

const COOKIE_BANNER_CLASS_PREFIX = 'js-cookie-guidance-banner'

function getClassName(className: string) {
  return `.${COOKIE_BANNER_CLASS_PREFIX}--${className}`
}

function getCookieMessageElements(
  parentElement: Element,
  types: string[],
) {
  return Object.fromEntries(types.map((type) => {
    const element = parentElement.querySelector<HTMLDivElement>(getClassName(type))
    if (!element) {
      throw new Error('Message not found')
    }
    return [type, {
      show: () => {
        element.removeAttribute('hidden')
      },
      hide: () => {
        element.setAttribute('hidden', 'hidden')
      },
    }]
  }))
}

export function initCookieBanner() {
  // Don't run on the cookies setting page
  const cookieSettingForm = document.querySelector<HTMLFormElement>('.js-cookie-setting-form')
  const cookieBannerEl = document.querySelector(getClassName('container'))

  const cookiePreference = getCookie(cookiePreferenceKey)

  if (
    cookiePreference === '1' || cookiePreference === '0' || !cookieBannerEl || cookieSettingForm
  ) {
    analyticsSetting(cookiePreference === '1')
    return
  }
  removeAnalyticCookies()
  const { permission, accept, reject } = getCookieMessageElements(cookieBannerEl, ['permission', 'accept', 'reject'])

  cookieBannerEl.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLButtonElement)) {
      return
    }
    const button = event.target
    switch (button.value) {
      case 'accept':
        permission.hide()
        accept.show()
        setCookie(cookiePreferenceKey, '1', 365)
        analyticsSetting(true)
        break
      case 'reject':
        setCookie(cookiePreferenceKey, '0', 365)
        analyticsSetting(false)
        permission.hide()
        reject.show()
        break
      case 'hide':
        cookieBannerEl.setAttribute('hidden', 'hidden')
        break
      default:
        break
    }
  })
  cookieBannerEl.removeAttribute('hidden')
  permission.show()
}
