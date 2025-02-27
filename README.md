# MOD.UK Frontend guidance site

This repo contains the source code for the
[MOD.UK Frontend guidance website](https://design-system.service.mod.gov.uk)

## Development

The library uses [Eleventy](https://www.11ty.dev/),
[Sass](https://sass-lang.com), [ESLint](https://eslint.org),
[Stylelint](https://stylelint.io/), [dprint](https://dprint.dev) and
[commitlint](https://commitlint.js.org). Git hooks (via
[Husky](https://typicode.github.io/husky/) and
[lint-staged](https://github.com/okonet/lint-staged)) are used for enforcing
linting and formatting rules.

The unit test suite uses [Vitest](https://vitest.dev) and
[Testing Library](https://testing-library.com).

The end-to-end test suite uses [Playwright](https://playwright.dev/). Tests are
run across a variety of browsers and configurations against a local web server
that serves examples of components. This includes accessibility checks using
[axe](https://www.deque.com/axe/) and visual regression tests.

Local development requires Node.js 16 or 18 and npm 8 or newer.

### Setting up your development environment

1. Clone the repository via SSH:

   ```shell
   git clone git@github.com:defencedigital/moduk-frontend-guidance-site.git
   cd moduk-frontend-guidance-site
   ```

   If you haven’t set up an SSH key for GitHub, you can clone via HTTPS instead:

   ```shell
   git clone https://github.com/defencedigital/moduk-frontend-guidance-site.git
   cd moduk-frontend-guidance-site
   ```

2. Install dependencies:

   ```shell
   npm install
   ```

3. Install Playwright browsers and system dependencies:

   ```shell
   npm run playwright-install
   ```

4. Install Podman using
   [the instructions for your platform](https://podman.io/getting-started/installation).

   Podman is required only for running visual regression tests.

5. Ensure jq is installed. On macOS it can be installed using
   [Homebrew](https://brew.sh/):

   ```shell
   brew install jq
   ```

   jq is required only for running visual regression tests.

### Commands

#### Start the server

```shell
npm start
```

#### Lint all files

```shell
npm run lint
```

#### Reformat all files

```shell
npm run format
```

#### Run all unit tests

```shell
npm test
```

#### Run end-to-end tests

```shell
npm run test:e2e
```

This runs end-to-end tests using Playwright for all configured browser
configurations. The Eleventy dev server is started automatically, and so does
not need to be started separately.

##### Run specific files using a regex

```shell
npm run test:e2e <regex>
```

You can also use `test.only` or `test.desribe.only` within a test file to run
only that test (and any other tests using `.only`).

##### Run tests with tracing

```shell
npm run test:e2e:trace
```

[Playwright traces](https://playwright.dev/docs/trace-viewer-intro) record
failed tests for debugging later, or on a different machine.

You can also debug tests [using VS code](https://playwright.dev/docs/debug), or
by [using the built-in inspector debugger](https://playwright.dev/docs/debug).

#### Run visual regression tests in a container

Visual regression tests run in a container, using Podman, to ensure screenshots
are taken in a consistent environment.

To run the visual regression tests:

```shell
npm run test:visual
```

This will also generate any missing screenshots.

#### Update visual regression snapshots

To update any screenshots that have changed:

```shell
npm run test:visual:refresh
```

#### Delete all visual regression snapshots

To delete all existing screenshots:

```shell
npm run test:visual:clean
```

This can be useful after renaming or deleting visual regression tests or
component examples.

#### Build the static site

```shell
npm run build
```

The built site is output to the `dist` directory.

#### Build and run the container image

```shell
podman build --tag moduk-frontend-guidance-site .
podman run --rm -p 8080:8080 -it moduk-frontend-guidance-site
```

The server will then be available at http://localhost:8080.

## Configuration

The `BASE_URL` environment variable can be set at build time to override the
base URL of Open Graph images specified in `<meta>` tags. If not set, it
defaults to using the images on the production site.

The `NO_INDEX` environment variable can be set at build time to add a `noindex`
`<meta>` tag to all pages.

## Acknowledgements

Some styles and markup are based on the
[GOV.UK Design System website](https://github.com/alphagov/govuk-design-system).
