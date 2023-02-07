// @ts-expect-error iframe-resizer is missing types for v4
import iframeResize from 'iframe-resizer/js/iframeResizer'

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

export function initComponentPreviewsIframe() {
  const createIframe = (componentPreviewContentItem: HTMLElement) => {
    const iframeEl = document.createElement('iframe')
    const { exampleName, iframeId, iframeTitle } = componentPreviewContentItem.dataset

    if (!exampleName || !iframeId || !iframeTitle) {
      return null
    }

    if ('loading' in iframeEl) {
      iframeEl.loading = 'lazy'
    }

    iframeEl.id = iframeId
    iframeEl.style.height = `${componentPreviewContentItem.clientHeight}px`
    iframeEl.className = componentPreviewContentItem.className
    iframeEl.src = `preview/${exampleName}/embed.html`
    iframeEl.title = iframeTitle

    return iframeEl
  }

  const componentPreviewContentItems = Array.from(
    document.querySelectorAll<HTMLElement>('.js-guidance-component-preview-iframe'),
  )

  componentPreviewContentItems.forEach((componentPreviewContentItem) => {
    const iframe = createIframe(componentPreviewContentItem)
    const parent = componentPreviewContentItem.parentElement
    if (!iframe || !parent) {
      return
    }

    parent.removeChild(componentPreviewContentItem)
    parent.appendChild(iframe)

    iframeResize({ autoResize: true, scrolling: 'auto' }, iframe)
  })
}

export function initComponentPreviews() {
  initComponentPreviewsIframe()
  const componentPreviews = Array.from(document.querySelectorAll<HTMLElement>('.js-guidance-component-preview'))

  componentPreviews.forEach((componentPreview) => {
    const tabManager = createTabManager(componentPreview)
    const tabItems = Array.from(
      componentPreview.querySelectorAll<HTMLAnchorElement>('.guidance-component-preview__tab-item-link'),
    )

    tabItems.forEach((tabItem) => {
      tabItem.setAttribute('aria-expanded', 'false')

      tabItem.addEventListener('click', (event) => {
        tabManager.activateTab(tabItem)
        event.preventDefault()
        event.stopPropagation()
      })
    })

    const mobileButtons = Array.from(componentPreview.querySelectorAll<HTMLButtonElement>(
      '.guidance-component-preview__mobile-button',
    ))
    mobileButtons.forEach((button) => {
      button.setAttribute('aria-expanded', 'false')

      button.addEventListener('click', (event) => {
        tabManager.activateTab(button)
        event.preventDefault()
        event.stopPropagation()
      })
    })

    const tabPanels = Array.from(componentPreview.querySelectorAll('.guidance-component-preview__tab-contents'))
    tabPanels.forEach((tabPanel) => {
      tabPanel.setAttribute('hidden', 'hidden')
    })
  })
}
