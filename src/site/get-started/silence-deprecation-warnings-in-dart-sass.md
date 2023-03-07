---
layout: layouts/markdown-page-with-side-nav.njk
title: Silence deprecation warnings in Dart Sass
description: This guide will help you silence deprecation warnings when compiling your Sass.
tags: get-started
order: 300
---

You may see deprecation warnings when compiling your Sass. For example:

```plaintext
DEPRECATION WARNING: Using / for division is deprecated and will be removed in Dart Sass 2.0.0.
```

You can silence the warnings caused by MOD.UK Frontend and other dependencies.

Make sure you’re using Dart Sass 1.49.10 or higher, and then if you’re:

- calling the Sass compiler from the command line, pass the `--quiet-deps flag`
- using the JavaScript API, include `quietDeps: true` in the options object

You’ll still see deprecation warnings if you’re using `/` for division in your
own Sass code.
