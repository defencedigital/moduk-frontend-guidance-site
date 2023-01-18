// @ts-expect-error @moduk/frontend does not yet support types
import * as mod from '@moduk/frontend/client'
import { initCodeSnippets } from './_includes/components/code-snippet'
import navigation from './_includes/components/navigation'

initCodeSnippets()
navigation()

mod.initAll()
