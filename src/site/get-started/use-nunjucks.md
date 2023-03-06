---
layout: layouts/markdown-page-with-side-nav.njk
title: Use Nunjucks
description: This guide will help you use Nunjucks to generate the HTML for components.
tags: get-started
order: 200
---

You can use our Nunjucks macros to generate the HTML for components.

You can also use macro options to change how a component looks or behaves.

If you use Nunjucks, your application will be easier to update when we release a
new version of MOD.UK Frontend.

To use Nunjucks, the frontend of your application must use Node.js.

## Before you start

You must first:

- [install MOD.UK Frontend with npm](/get-started/setup-guide-for-developers/)
- make sure you’ve installed Nunjucks so it’s working in your environment

## Set up Nunjucks

Use the `createNunjucksEnvironment()` function to create a Nunjucks environment:

```javascript
import { createNunjucksEnvironment } from '@moduk/frontend'

const env = createNunjucksEnvironment(['YOUR-VIEWS-FOLDER'])
```

The created environment will be preconfigured with template paths and filters
used by MOD.UK Frontend.

The environment should be passed to the framework you’re using.

If you’re using [Express](https://expressjs.com/), this can be done by passing
your application object to `createNunjucksEnvironment()`:

```javascript
createNunjucksEnvironment(['YOUR-VIEWS-FOLDER'], { express: app })
```

## Adding a component

As an example,
[copy the Nunjucks code snippet for a button](/components/button/) and paste it
into your application.

## Protect your website against attacks

You must sanitise any HTML you pass in to Nunjucks macros in your live
application to protect against
[cross-site scripting](https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#cross-site_scripting_xss)
(XSS) attacks.
