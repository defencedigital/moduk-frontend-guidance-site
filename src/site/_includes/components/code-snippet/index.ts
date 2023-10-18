function createTextOverrider(element: HTMLElement, timeoutMs: number) {
  let timeoutId: NodeJS.Timeout | number | null
  const initialText = element.innerText

  return {
    cancelOverrideTimer: () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    },
    overrideText: (newText: string) => {
      // eslint-disable-next-line no-param-reassign
      element.innerText = newText

      timeoutId = setTimeout(() => {
        // eslint-disable-next-line no-param-reassign
        element.innerText = initialText
        timeoutId = null
      }, timeoutMs)
    },
  }
}

export function initCodeSnippets() {
  const copyButtons = Array.from(document.querySelectorAll<HTMLElement>('.js-guidance-copy-button'))

  copyButtons.forEach((copyButton) => {
    if (!navigator.clipboard?.writeText) {
      // eslint-disable-next-line no-param-reassign
      copyButton.className += ' no-navigator-clipboard'
      return
    }

    const { cancelOverrideTimer, overrideText } = createTextOverrider(copyButton, 5_000)

    copyButton.addEventListener('click', () => {
      async function handleClick() {
        try {
          cancelOverrideTimer()

          if (!copyButton.dataset.code) {
            throw new Error('Missing data-code attribute')
          }

          await navigator.clipboard.writeText(JSON.parse(copyButton.dataset.code).val)

          overrideText('Code copied')
        } catch {
          overrideText('Copy failed')
        }
      }

      handleClick()
    })
  })
}
