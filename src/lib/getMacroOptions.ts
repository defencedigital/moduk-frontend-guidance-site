/**
 * This file contains functionality equivalent to
 * https://github.com/alphagov/govuk-design-system/blob/c18bde2a0e618121d1995d5a7b0d8ce801c858d2/lib/get-macro-options/index.js
 */

import { sortBy } from 'lodash'
import { dirname, join } from 'node:path'

interface MacroOption {
  name: string
  description?: string
  isComponent?: boolean
  isUnnested?: true
  params?: MacroOption[]
  path?: string
  required: boolean
  type: string
}

interface NestedOptionGroup {
  name: string
  path: string
  params: MacroOption[]
}

interface TransformedOptions {
  primary: MacroOption[]
  nested: NestedOptionGroup[]
}

// These are internal components that don't have their own dedicated pages,
// and so they must be embedded and unnested whenever used
const COMPONENTS_TO_EMBED = new Set(['hint', 'label'])

export async function getRawMacroOptions(componentName: string) {
  const govukPath = dirname(require.resolve('govuk-frontend'))
  const optionsJsonPath = join(govukPath, 'components', componentName, 'macro-options.json')
  return (await import(optionsJsonPath)).default
}

function removeNestedOptions(options: MacroOption[]): MacroOption[] {
  return options.map(({ params, ...rest }) => ({
    ...rest,
    ...(params ? { isUnnested: true } : {}),
  }))
}

function getNestedOptions(options: MacroOption[]): NestedOptionGroup[] {
  if (!options.length) {
    return []
  }

  const optionGroups = options.filter((option): option is MacroOption & { params: MacroOption[] } =>
    Boolean(option.params?.length)
  ).map((option) => ({
    name: option.name,
    path: option.path ? `${option.path}.${option.name}` : option.name,
    params: removeNestedOptions(option.params),
  }))

  const optionsToUnnest = options.flatMap((option) => {
    if (!option?.params) {
      return []
    }

    return option.params.filter((nestedOption) => nestedOption.params).map((nestedOption) => ({
      ...nestedOption,
      path: option.path ? `${option.path}.${option.name}` : option.name,
    }))
  })

  return [
    ...optionGroups,
    ...getNestedOptions(optionsToUnnest),
  ]
}

export function transformMacroOptions(options: MacroOption[]): TransformedOptions {
  return {
    primary: removeNestedOptions(options),
    nested: getNestedOptions(options),
  }
}

export async function addInternalComponents(transformedOptions: TransformedOptions) {
  const componentsToEmbed = [
    ...transformedOptions.primary,
    ...transformedOptions.nested.flatMap((entry) => entry.params),
  ].filter(
    (option) => option.isComponent && COMPONENTS_TO_EMBED.has(option.name),
  ).map(
    (param) => param.name,
  )

  const uniqueComponentsToEmbed = new Set(componentsToEmbed)
  const updatedOptions = transformedOptions

  // eslint-disable-next-line no-restricted-syntax
  for (const componentName of uniqueComponentsToEmbed) {
    // eslint-disable-next-line no-await-in-loop
    const rawOptions = await getRawMacroOptions(componentName)
    // Further unnesting is not handled for these, as there are no current cases of this
    updatedOptions.nested.push({ name: componentName, path: componentName, params: rawOptions })
  }
  return updatedOptions
}

function sortTransformedComponents({ nested, ...rest }: TransformedOptions): TransformedOptions {
  return {
    ...rest,
    nested: sortBy(nested, 'path'),
  }
}

export async function getMacroOptions(componentName: string) {
  const rawOptions = await getRawMacroOptions(componentName)
  const transformedOptions = transformMacroOptions(rawOptions)
  return sortTransformedComponents(await addInternalComponents(transformedOptions))
}
