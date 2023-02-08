---
layout: layouts/markdown-content-page.njk
title: Use a module bundler
description: This guide will help you use a module bundler like Webpack.
tags: get-started
order: 400
---

If you’re using a bundler like Webpack, MOD.UK Frontend components can be
initialised as part of your bundle.

```js
import { initAll } from '@moduk/frontend/client'

initAll()
```

If that does not work, import `initAll` from
`@moduk/frontend/dist/client/moduk-frontend.umd.js`.

Remember to check that interactive components such as the accordion still
function correctly after doing this.

## Using TypeScript

If you’re using this in a TypeScript project, you will need to skip
type-checking on the library:

```ts
// @ts-expect-error @moduk/frontend does not include type definitions
import * as moduk from '@moduk/frontend/client'
```
