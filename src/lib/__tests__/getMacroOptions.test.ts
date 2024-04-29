import { describe, expect, it, vi } from 'vitest'
import { addInternalComponents, transformMacroOptions } from '../getMacroOptions'

vi.mock('govuk-frontend/dist/govuk/components/hint/macro-options.json', () => ({
  default: [
    {
      name: 'hint-test',
      type: 'string',
      required: true,
    },
  ],
}))

const MACRO_OPTIONS = [
  {
    name: 'homepageUrl',
    type: 'string',
    required: false,
    description: 'The URL of the homepage. Defaults to `/`',
  },
  {
    name: 'navigation',
    type: 'array',
    required: false,
    description: 'An array of navigation item objects.',
    params: [
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'Text for the navigation item. If `html` is provided, the `text` option will be ignored.',
      },
      {
        name: 'another-nested',
        type: 'array',
        required: false,
        description: 'An array of nested item objects.',
        params: [
          {
            name: 'text',
            type: 'string',
            required: true,
            description: 'Example description.',
          },
        ],
      },
    ],
  },
]

describe('transformMacroOptions', () => {
  it('extracts nested options', async () => {
    expect(transformMacroOptions(MACRO_OPTIONS)).toEqual({
      primary: [
        {
          description: 'The URL of the homepage. Defaults to `/`',
          name: 'homepageUrl',
          required: false,
          type: 'string',
        },
        {
          description: 'An array of navigation item objects.',
          name: 'navigation',
          required: false,
          type: 'array',
          isUnnested: true,
        },
      ],
      nested: [
        {
          name: 'navigation',
          path: 'navigation',
          params: [
            {
              description: 'Text for the navigation item. If `html` is provided, the `text` option will be ignored.',
              name: 'text',
              required: true,
              type: 'string',
            },
            {
              name: 'another-nested',
              type: 'array',
              required: false,
              description: 'An array of nested item objects.',
              isUnnested: true,
            },
          ],
        },
        {
          name: 'another-nested',
          path: 'navigation.another-nested',
          params: [
            {
              name: 'text',
              type: 'string',
              required: true,
              description: 'Example description.',
            },
          ],
        },
      ],
    })
  })
})

describe('addInternalComponents', () => {
  it('only adds internal components', async () => {
    const options = await addInternalComponents({
      primary: [
        {
          name: 'hint',
          isComponent: true,
          required: false,
          type: 'object',
        },
        {
          name: 'external',
          isComponent: true,
          required: false,
          type: 'object',
        },
      ],
      nested: [],
    })

    expect(options).toEqual({
      primary: [
        {
          name: 'hint',
          isComponent: true,
          required: false,
          type: 'object',
        },
        {
          name: 'external',
          isComponent: true,
          required: false,
          type: 'object',
        },
      ],
      nested: [
        {
          name: 'hint',
          path: 'hint',
          params: [
            {
              name: 'hint-test',
              type: 'string',
              required: true,
            },
          ],
        },
      ],
    })
  })

  it('does not add the same component more than once', async () => {
    const options = await addInternalComponents({
      primary: [
        {
          name: 'hint',
          isComponent: true,
          required: false,
          type: 'object',
        },
        {
          name: 'hint',
          isComponent: true,
          required: false,
          type: 'object',
        },
      ],
      nested: [],
    })

    expect(options).toEqual({
      primary: [
        {
          name: 'hint',
          isComponent: true,
          required: false,
          type: 'object',
        },
        {
          name: 'hint',
          isComponent: true,
          required: false,
          type: 'object',
        },
      ],
      nested: [
        {
          name: 'hint',
          path: 'hint',
          params: [
            {
              name: 'hint-test',
              type: 'string',
              required: true,
            },
          ],
        },
      ],
    })
  })
})
