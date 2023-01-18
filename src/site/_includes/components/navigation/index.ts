/**
 * This utility function is based on the GOV.UK equivalent from the GOV.UK Frontend:
 * https://github.com/alphagov/govuk-frontend/blob/8850e53c6f852117bf3a8e32fa883e8f629f659f/package/govuk-esm/components/header/header.mjs
 */

type MediaQuery = MediaQueryListEvent | MediaQueryList

function navigation() {
  let menuIsOpen = false
  const menuButton = document.querySelector<HTMLButtonElement>('.guidance-js-header-toggle')
  const menuEl = document.querySelector<HTMLElement>('.js-guidance-navigation')
  if (!(menuButton && menuEl)) {
    return
  }

  const mediaQueryList = window.matchMedia('(min-width: 48.0625em)')

  const toggleState = (mediaQuery: MediaQuery) => {
    if (mediaQuery.matches) {
      menuEl.removeAttribute('hidden')
      menuButton.setAttribute('hidden', '')
    } else {
      menuButton.removeAttribute('hidden')
      menuButton.setAttribute('aria-expanded', `${menuIsOpen}`)

      if (menuIsOpen) {
        menuEl.removeAttribute('hidden')
      } else {
        menuEl.setAttribute('hidden', '')
      }
    }
  }

  toggleState(mediaQueryList)

  if ('addEventListener' in mediaQueryList) {
    mediaQueryList.addEventListener('change', toggleState)
  } else {
    // addListener is a deprecated function, however addEventListener
    // isn't supported by IE or Safari. We therefore add this in as
    // a fallback for those browsers
    // @ts-expect-error addEventListener' in mediaQueryList == true in libdom this results in mediaQueryList being type never
    mediaQueryList.addListener(mediaQueryList)
  }
  menuButton.addEventListener('click', () => {
    menuIsOpen = !menuIsOpen
    toggleState(mediaQueryList)
  })
}

export default navigation
