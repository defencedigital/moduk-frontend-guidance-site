---
layout: layouts/markdown-content-page.njk
title: Change the image assets path
description: This guide will help you build the CSS to point to your images folder.
tags: get-started
order: 500
---

If you use a different folder structure than `<YOUR-APP>/assets/images` , you
can set a Sass variable so that Sass builds the CSS to point to your images
folder.

Set `$moduk-images-path` before the `@import` line in your Sass file. Set it to
the path of your images folder. For example:

```scss
$moduk-images-path: '/<YOUR-IMAGES-FOLDER>/';
```
