// @ts-expect-error iframe-resizer is missing types for v4
import iframeResize from 'iframe-resizer/js/iframeResizer'

import { initComponentPreviewsTabs } from '../component-preview-tabs'

export function initComponentPreviewsIframe() {
  const createIframe = (componentPreviewContentItem: HTMLElement) => {
    const iframeEl = document.createElement('iframe')
    const { exampleName, iframeId, iframeTitle, componentName } = componentPreviewContentItem.dataset

    if (!exampleName || !iframeId || !iframeTitle) {
      return null
    }

    if ('loading' in iframeEl) {
      iframeEl.loading = 'lazy'
    }

    iframeEl.id = iframeId
    iframeEl.style.height = `${componentPreviewContentItem.clientHeight}px`
    iframeEl.className = componentPreviewContentItem.className
    iframeEl.src = `/components/${componentName}/preview/${exampleName}/embed.html`
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
    initComponentPreviewsTabs(componentPreview)
  })
}
