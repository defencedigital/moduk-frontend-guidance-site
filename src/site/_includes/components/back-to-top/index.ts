/**
 * Based on
 * https://github.com/alphagov/govuk-design-system/blob/e770df0ebc43439b828d46f2c7f5a71a8eff3007/src/javascripts/components/back-to-top.mjs
 */

export function initBackToTop() {
  const backToTop = document.querySelector<HTMLElement>('.js-guidance-back-to-top')

  if (!backToTop) {
    return
  }

  if (typeof IntersectionObserver === 'undefined') {
    backToTop.classList.remove('guidance-back-to-top--hidden')
    return
  }

  const sideNav = document.querySelector('.guidance-side-nav')
  const footer = document.querySelector('.govuk-footer')

  if (!sideNav || !footer) {
    return
  }

  let sideNavIntersectsViewport = false
  let sideNavFullyVisible = false
  let footerIntersectsViewport = false

  const intersectionObserver = new IntersectionObserver((entries) => {
    const sideNavEntry = entries.find((entry) => entry.target === sideNav)
    const footerEntry = entries.find((entry) => entry.target === footer)

    if (sideNavEntry) {
      sideNavIntersectsViewport = sideNavEntry.isIntersecting
      sideNavFullyVisible = sideNavEntry.intersectionRatio === 1
    }

    if (footerEntry) {
      footerIntersectsViewport = footerEntry.isIntersecting
    }

    if (sideNavFullyVisible) {
      backToTop.classList.add('guidance-back-to-top--hidden')
    } else {
      backToTop.classList.remove('guidance-back-to-top--hidden')
    }

    if (!(sideNavIntersectsViewport || footerIntersectsViewport)) {
      backToTop.classList.add('guidance-back-to-top--fixed')
    } else {
      backToTop.classList.remove('guidance-back-to-top--fixed')
    }
  })

  intersectionObserver.observe(sideNav)
  intersectionObserver.observe(footer)
}
