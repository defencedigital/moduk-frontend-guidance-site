import { getCookie, setCookie } from './cookie'

const COOKIE_BANNER_CLASS_PREFIX = 'js-cookie-guidance-banner'
const COOKIE_PREFERENCE_KEY = 'design-system-cookie-preference'

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
  const cookiePromptEnabled = new URLSearchParams(document.location.search).has('cookie_prompt_enabled')

  const cookieBannerEl = document.querySelector(getClassName('container'))

  const cookiePreference = getCookie(COOKIE_PREFERENCE_KEY)
  if (!cookiePromptEnabled || cookiePreference === '1' || cookiePreference === '0' || !cookieBannerEl) {
    return
  }

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
        setCookie(COOKIE_PREFERENCE_KEY, '1', 365)
        break
      case 'reject':
        setCookie(COOKIE_PREFERENCE_KEY, '0', 365)
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
