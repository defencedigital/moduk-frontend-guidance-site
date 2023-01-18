import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { initCodeSnippets } from '..'

describe('initCodeSnippets', () => {
  it('copies the text on click', async () => {
    userEvent.setup()

    const button = document.createElement('button')
    button.classList.add('js-guidance-copy-button')
    button.dataset.code = JSON.stringify({ val: 'testCode();' })
    document.body.appendChild(button)

    initCodeSnippets()

    button.click()

    expect(await navigator.clipboard.readText()).toBe('testCode();')
    expect(button.innerText).toBe('Code copied')
  })
})
