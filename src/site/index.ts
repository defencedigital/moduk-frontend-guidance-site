// @ts-expect-error @moduk/frontend does not include type definitions
import * as mod from '@moduk/frontend/client'
import { initCodeSnippets } from './_includes/components/code-snippet'
import navigation from './_includes/components/navigation'

initCodeSnippets()
navigation()

mod.initAll()
