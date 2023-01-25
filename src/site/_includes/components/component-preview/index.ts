function createTabManager(componentPreview: HTMLElement) {
  let activeTab: {
    id: string
    desktopLink: Element
    mobileButton: Element
  } | null = null

  return {
    activateTab: (clickElement: HTMLElement) => {
      const { tabId: newTabId } = clickElement.dataset
      const isSelfClick = activeTab?.id === newTabId

      const newDesktopLink = componentPreview.querySelector(`[role="tab"][data-tab-id="${newTabId}"]`)
      const newMobileButton = componentPreview.querySelector(`[role="button"][data-tab-id="${newTabId}"]`)

      if (activeTab) {
        activeTab.desktopLink.setAttribute('aria-expanded', 'false')
        activeTab.desktopLink.parentElement?.classList.remove('guidance-component-preview__tab-item--current')
        activeTab.mobileButton.setAttribute('aria-expanded', 'false')
        activeTab.mobileButton.classList.remove('guidance-component-preview__mobile-button--current')

        const tabPanelId = activeTab.desktopLink.getAttribute('aria-controls')

        if (tabPanelId) {
          const tabPanel = document.getElementById(tabPanelId)
          tabPanel?.setAttribute('hidden', 'hidden')
        }

        activeTab = null
      }

      if (isSelfClick || !newTabId || !newDesktopLink || !newMobileButton) {
        return
      }

      newDesktopLink.setAttribute('aria-expanded', 'true')
      newDesktopLink.parentElement?.classList.add('guidance-component-preview__tab-item--current')
      newMobileButton.setAttribute('aria-expanded', 'true')
      newMobileButton.classList.add('guidance-component-preview__mobile-button--current')
      const tabPanelId = newDesktopLink.getAttribute('aria-controls')

      if (tabPanelId) {
        const tabPanel = document.getElementById(tabPanelId)
        tabPanel?.removeAttribute('hidden')
      }

      activeTab = {
        id: newTabId,
        desktopLink: newDesktopLink,
        mobileButton: newMobileButton,
      }
    },
  }
}

export function initComponentPreviews() {
  const componentPreviews = Array.from(document.querySelectorAll<HTMLElement>('.js-guidance-component-preview'))

  componentPreviews.forEach((componentPreview) => {
    const tabManager = createTabManager(componentPreview)
    const tabItems = Array.from(
      componentPreview.querySelectorAll<HTMLAnchorElement>('.guidance-component-preview__tab-item-link'),
    )

    tabItems.forEach((tabItem) => {
      tabItem.setAttribute('aria-expanded', 'false')

      tabItem.addEventListener('click', () => {
        tabManager.activateTab(tabItem)
        // Let the default handler kick in to scroll to the tab contents if necessary
      })
    })

    const mobileButtons = Array.from(componentPreview.querySelectorAll<HTMLButtonElement>(
      '.guidance-component-preview__mobile-button',
    ))
    mobileButtons.forEach((button) => {
      button.setAttribute('aria-expanded', 'false')

      button.addEventListener('click', () => {
        tabManager.activateTab(button)
        // Let the default handler kick in to scroll to the tab contents if necessary
      })
    })

    const tabPanels = Array.from(componentPreview.querySelectorAll('.guidance-component-preview__tab-contents'))
    tabPanels.forEach((tabPanel) => {
      tabPanel.setAttribute('hidden', 'hidden')
    })
  })
}
