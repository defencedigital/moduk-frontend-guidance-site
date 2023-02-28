import 'core-js/actual/array/from'
import 'core-js/actual/array/find'
import 'core-js/actual/object/from-entries'
import 'core-js/actual/string/starts-with'
import 'core-js/web/url-search-params'
// @ts-expect-error @moduk/frontend does not include type definitions
import * as mod from '@moduk/frontend/client'
import { initCodeSnippets } from './_includes/components/code-snippet'
import { initComponentPreviews } from './_includes/components/component-preview'
import { initCookieBanner } from './_includes/components/cookie'
import { initNavigation } from './_includes/components/navigation'

initCodeSnippets()
initComponentPreviews()
initCookieBanner()
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
