# MOD.UK Frontend guidance site

This repo contains the source code for the MOD.UK Frontend guidance website.

## Development

The library uses [Eleventy](https://www.11ty.dev/),
[Sass](https://sass-lang.com), [ESLint](https://eslint.org),
[dprint](https://dprint.dev) and [commitlint](https://commitlint.js.org). Git
hooks are used for enforcing linting and formatting rules.

The unit test suite uses [Vitest](https://vitest.dev) and
[Testing Library](https://testing-library.com).

The end-to-end test suite uses [Playwright](https://playwright.dev/). Tests are
run across a variety of browsers and configurations against a local web server
that serves examples of components. This includes accessibility checks using
[axe](https://www.deque.com/axe/) and visual regression tests.

Local development requires Node.js 16 or 18 and npm 8.

### Setting up your development environment

1. Clone the repository:

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

   jq is required only for running visual regression tests.

   ```shell
   brew install jq
   ```

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

##### Run specific files using a regex

```shell
npm run test:e2e <regex>
```

##### Run tests with tracing

```shell
npm run test:e2e:trace
```

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
