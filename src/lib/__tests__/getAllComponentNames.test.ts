import { describe, expect, it } from 'vitest'
import { getAllComponentNames } from '../getAllComponentNames'

describe('getAllComponentNames', () => {
  it('returns all component names', () => {
    expect(new Set(getAllComponentNames())).toEqual(
      new Set([
        'accordion',
        'back-link',
        'breadcrumbs',
        'button',
        'character-count',
        'checkboxes',
        'cookie-banner',
        'date-input',
        'details',
        'error-message',
        'error-summary',
        'fieldset',
        'file-upload',
        'footer',
        'header',
        'input',
        'inset-text',
        'notification-banner',
        'pagination',
        'panel',
        'phase-banner',
        'radios',
        'select',
        'skip-link',
        'summary-list',
        'table',
        'tabs',
        'tag',
        'textarea',
        'warning-text',
      ]),
    )
  })
})
