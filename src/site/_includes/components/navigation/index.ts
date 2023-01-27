type MediaQuery = MediaQueryListEvent | MediaQueryList
type ToggleControl = (mediaQuery: MediaQuery) => void

function navigation(menuButton: HTMLButtonElement, menuEl: HTMLElement, mediaQueryList: MediaQuery) {
  let menuIsOpen = menuButton.getAttribute('data-initial-open') === 'true'

  const toggleState = (mediaQuery: MediaQuery) => {
    if (mediaQuery.matches) {
      if (menuEl.getAttribute('data-list-type') === 'primary') {
        menuEl.removeAttribute('hidden')
      } else {
        menuEl.setAttribute('hidden', '')
      }
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

  menuButton.addEventListener('click', (evt) => {
    evt.preventDefault()
    menuIsOpen = !menuIsOpen
    toggleState(mediaQueryList)
  })

  return toggleState
}

export function initNavigation() {
  const menuButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.js-guidance-toggle'))

  const mediaQueryList = window.matchMedia('(min-width: 40.0625em)')
  const toggleControls: ToggleControl[] = []

  menuButtons.forEach((menuButton) => {
    const controls = menuButton.getAttribute('aria-controls')
    const menuEl = controls && document.getElementById(controls)
    if (menuEl) {
      toggleControls.push(navigation(menuButton, menuEl, mediaQueryList))
    }
  })

  const mediaQueryHandler = (mediaQuery: MediaQuery) => {
    toggleControls.forEach((toggleControl) => toggleControl(mediaQuery))
  }

  if ('addEventListener' in mediaQueryList) {
    mediaQueryList.addEventListener('change', mediaQueryHandler)
  } else {
    // addListener is a deprecated function, however addEventListener
    // isn't supported by IE or Safari. We therefore add this in as
    // a fallback for those browsers
    // @ts-expect-error addEventListener' in mediaQueryList == true in libdom this results in mediaQueryList being type never
    mediaQueryList.addListener(mediaQueryHandler)
  }
}
