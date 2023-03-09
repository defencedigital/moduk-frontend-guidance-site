export const COOKIE_PREFERENCE_KEY = 'design-system-cookie-preference'

export function getCookie(name: string) {
  const cookies = document.cookie.split('; ')
  return cookies.find((row) => row.startsWith(`${name}=`))?.split('=')[1] || null
}

export function setCookie(name: string, value: string, daysValid: number) {
  const date = new Date()
  date.setTime(date.getTime() + (daysValid * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value}; path=/; expires=${date.toUTCString()}; SameSite=Lax; Secure`
}

export function deleteCookie(name: string) {
  if (getCookie(name)) {
    // Cookies need to be deleted in the same level of specificity in which they were set
    // If a cookie was set with a specified domain, it needs to be specified when deleted
    // If a cookie wasn't set with the domain attribute, it shouldn't be there when deleted
    // You can't tell if a cookie was set with a domain attribute or not, so try both options
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=${window.location.hostname};path=/`
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.${window.location.hostname};path=/`
  }
}
