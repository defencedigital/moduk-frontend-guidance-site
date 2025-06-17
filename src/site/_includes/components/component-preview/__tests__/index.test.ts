/* eslint no-console: ["error", { allow: ["warn"] }] */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initComponentPreviewsIframe } from '..'

const html = `
  <div class="original-class js-guidance-component-preview-iframe" data-component-name="test" data-example-name="test-component" data-iframe-id="test-component--iframe" data-iframe-title="test-component-title">
      <div class="original-class-content" >
        Template content
      </div>
    </div>
  </div>
`

describe('initComponentPreviewsIframe', () => {
  // console.warn is being mocked here to suppress "content not found" warning from iFrameSizer
  const originalWarn = console.warn

  beforeEach(() => {
    console.warn = vi.fn()
  })

  afterEach(() => {
    console.warn = originalWarn
  })

  it('replaces content with iframe', async () => {
    const template = document.createElement('template')
    template.innerHTML = html

    document.body.appendChild(template.content)
    initComponentPreviewsIframe()
    const iframe = document.getElementsByTagName('iframe')[0]
    expect(iframe).toHaveClass('original-class', 'js-guidance-component-preview-iframe')
    expect(iframe).toHaveAttribute('id', 'test-component--iframe')
    expect(iframe).toHaveAttribute('title', 'test-component-title')
    expect(iframe?.src).toContain('/components/test/preview/test-component/embed.html')
  })
})
