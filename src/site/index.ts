import 'core-js/actual/array/from'
// @ts-expect-error @moduk/frontend does not include type definitions
import * as mod from '@moduk/frontend/client'
import { initCodeSnippets } from './_includes/components/code-snippet'
import { initComponentPreviews } from './_includes/components/component-preview'
import { initNavigation } from './_includes/components/navigation'

initCodeSnippets()
initComponentPreviews()
initNavigation()

mod.initAll()
