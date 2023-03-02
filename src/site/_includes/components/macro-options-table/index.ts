export function initMacroOptionsTable() {
  const locationHash = window.location.hash
  const hashMatchResult = locationHash.match(/^#options--(?<exampleName>.*)--details/)
  const { exampleName } = hashMatchResult?.groups ?? {}

  if (!exampleName) {
    return
  }

  const details = document.getElementById(`options--${exampleName}--details`)
  const detailsSummary = details?.querySelector<HTMLElement>('.govuk-details__summary')

  if (!details || !detailsSummary) {
    return
  }

  const tabSelector = `[role="tab"][data-tab-id="${details.dataset.tabId}"]`
  const tab = document.querySelector<HTMLAnchorElement>(tabSelector)

  if (!tab) {
    return
  }

  tab.click()
  detailsSummary.click()

  const focusDetailsSummary = () => detailsSummary?.focus()

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(focusDetailsSummary)
    })
  } else {
    focusDetailsSummary()
  }
}
