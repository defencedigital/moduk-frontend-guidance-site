---
layout: layouts/markdown-content-page.njk
title: Setup guide for developers
description: This guide explains how to set up your project so you can start using the components in the MOD.UK Frontend in production.
tags: get-started
order: 100
---

Having set up your application using your chosen framework, get one MOD.UK
Frontend component working to test everything works.

You’ll need to follow these steps:

1. Install MOD.UK Frontend using npm.
2. Add the HTML for a component to your application.
3. Load the CSS.
4. Add the images.
5. Load the JavaScript.

We’ve assumed you’re able to use npm. Email
[design-system@digital.mod.uk](mailto:design-system@digital.mod.uk "mailto:design-system@digital.mod.uk")
if you’re not able to.

## 1. Install MOD.UK Frontend using npm

[Install Node.js](https://nodejs.org/en/). We recommend version 18. You can use
version 16 if you want to.

`cd` to the root of your project and check if you have a `package.json` file. If
you do not have the file, create it by running:

```shell
npm init
```

### Install Dart Sass

[Install Dart Sass](https://www.npmjs.com/package/sass) if you want to use Sass.
We recommend version 1.56.1 or higher. Run:

```shell
npm install --save-dev sass
```

Do not use other implementations of Sass, such as Node Sass. Dart Sass gets new
features before other implementations.

### If you’re not using Sass

We provide a compiled CSS file you can use in step 3 (Load the CSS) if you’re
not using Sass.

### Install Nunjucks

[Install Nunjucks](https://www.npmjs.com/package/nunjucks) version 3.2.3 or
higher if you want to use MOD.UK Frontend’s Nunjucks macros:

```shell
npm install nunjucks
```

### If you’re not using Nunjucks

You can still use the HTML snippets for each component if you’re not using
Nunjucks.

### Install MOD.UK Frontend and GOV.UK Frontend

Install both MOD.UK Frontend and GOV.UK Frontend:

```shell
npm install @moduk/frontend govuk-frontend
```

When the installation finishes, the `@moduk/frontend` package will be in your
`node_modules` folder.

## 2. Add the HTML for a component to your application

[Copy the HTML for the accordion component](/components/accordion/) and paste it
into a page or template in your application. The accordion will help you check
everything is working, including the JavaScript in step 5.

In production we recommend [using Nunjucks](/get-started/using-nunjucks/) if
you’re able to.

## 3. Load the CSS

### If you’re using Sass

Add the following to the main Sass file in your project, so your Sass compiler
adds all of MOD.UK Frontend’s styles to your CSS file:

```scss
@import '@moduk/frontend/src/css';
```

Check your existing Sass config to make sure `node_modules` has been added to
the [load paths](https://sass-lang.com/documentation/cli/dart-sass#load-path).

If you’re using the `sass` command-line tool, this can be done by adding
`--load-path=node_modules` to your command line.

You may see deprecation warnings when compiling your Sass. You can silence
deprecation warnings caused by third-party dependencies if required.

### If you’re not using Sass

We provide a compiled version of the CSS if you’re not using Sass.

Copy the `node_modules/@moduk/frontend/dist/css/index.css` file to
`<YOUR-STATIC-FILES-FOLDER>/index.css`.

### Add CSS file to your page template

Add your CSS file to the `<head>` section of your page template if you have not
already done so. For example:

```html
<head>
...
<link rel="stylesheet" href="<YOUR-CSS-FILE>.css">
</head>
```

### Run your application

Run your application and check that the accordion displays correctly.

The accordion will not be interactive until you’ve completed step 5 (Load the
JavaScript).

## 4. Add the images

Some components such as the footer have images

These images will not display until you’ve added MOD.UK Frontend’s assets to
your application.

Create the `<YOUR-STATIC-FILES-FOLDER>/assets/images` folder if it does not
exist.

Copy the folder `node_modules/@moduk/frontend/dist/assets/images/` to
`<YOUR-STATIC-FILES-FOLDER>/assets/images`.

If the static files folder is `public`, you can copy with these commands:

**macOS and Linux:**

```shell
cp -R node_modules/@moduk/frontend/dist/assets/images public/assets/
```

**Windows (command prompt):**

```batch
copy node_modules\@moduk\frontend\dist\assets\images public\assets\images\
```

In your live site, we recommend using an automated task instead of copying the
files manually.

## 5. Load the JavaScript

### Add script tag

Add a `<script>` tag at the start of your `<body>` section. Your page should
look like this example:

```html
<body>
    <script>
        document.body.className = ((document.body.className) ? document.body.className + 'js-enabled' : 'js-enabled');
    </script>
    ...
</body>
```

### Copy JavaScript file

Copy the `node-modules/@moduk/frontend/dist/client/moduk-frontend.umd.js` file
to `<YOUR-STATIC-FILES-FOLDER>/moduk-frontend.umd.js`.

If the app JavaScript folder is `public`, you can copy with these commands:

**macOS and Linux:**

```shell
cp node_modules/@moduk/frontend/dist/client/moduk-frontend.umd.js public/
```

**Windows (command prompt):**

```batch
copy node_modules\@moduk\frontend\dist\client\moduk-frontend.umd.js public\
```

In your live site, we recommend using an automated task instead of copying the
file manually.

### Import JavaScript file and initialise components

Just before the closing `</body>` tag, import the file and initialise the
components. Your page should look like this example:

```html
<body>
    <script>
        document.body.className = ((document.body.className) ? document.body.className + 'js-enabled' : 'js-enabled');
    </script>

<!-- YOUR PAGE CONTENT GOES HERE -->

    <script src="<YOUR-STATIC-FILES-FOLDER>/moduk-frontend.umd.js"></script>
    <script>
        window.MODUK.initAll()
    </script>
</body>
```

### Run your application

Run your application and check it works the same way as the
[MOD.UK Design System accordion example](/components/accordion/), by selecting
the buttons and checking the accordion shows and hides sections.
