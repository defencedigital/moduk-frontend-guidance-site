import 'core-js/actual/array/from'
// @ts-expect-error @moduk/frontend does not include type definitions
import * as mod from '@moduk/frontend/client'
import { initCodeSnippets } from './_includes/components/code-snippet'
import { initComponentPreviews } from './_includes/components/component-preview'
import { initNavigation } from './_includes/components/navigation'

initCodeSnippets()
initComponentPreviews()
initNavigation()

mod.initAll({
  // auto focusing the error summary and notification banner is not useful
  // when used in examples, and causes the viewport to scroll
  errorSummary: {
    disableAutoFocus: true,
  },
  notificationBanner: {
    disableAutoFocus: true,
  },
})
