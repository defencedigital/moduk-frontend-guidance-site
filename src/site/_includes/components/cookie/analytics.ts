import { deleteCookie } from './cookie'

export function removeAnalyticCookies() {
  deleteCookie('_ga')
  if (window.googleTagId) {
    deleteCookie(`_ga_${window.googleTagId.replace(/^G-/, '')}`)
  }
}

export function analyticsSetting(enabled: boolean) {
  window.gtag?.('consent', 'update', {
    analytics_storage: enabled ? 'granted' : 'denied',
  })

  if (enabled) {
    return
  }
  removeAnalyticCookies()
}
