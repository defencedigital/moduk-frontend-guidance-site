import AxeBuilder from '@axe-core/playwright'
import { devices, expect, Page, PlaywrightTestConfig } from '@playwright/test'

expect.extend({
  toHaveNoViolations: async (
    page: Page,
    disabledRules?: string[],
  ) => {
    const axeResults = await new AxeBuilder({ page })
      .disableRules(disabledRules ?? [])
      .analyze()

    const pass = axeResults.violations.length === 0
    if (pass) {
      return {
        message: () => 'expected violations',
        pass: true,
      }
    }
    const messages = axeResults.violations.map((violation) => (
      [
        `${violation.impact}(${violation.id}): ${violation.help}`,
        ...violation.nodes.map((node) => node.html),
      ].join('\n')
    ))

    return {
      message: () => messages.join('\n'),
      pass: false,
    }
  },
})

const config: PlaywrightTestConfig = {
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      scale: 'device',
    },
  },
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  maxFailures: process.env.CI ? 10 : undefined,
  outputDir: 'e2e/output/artefacts/',
  projects: [
    {
      name: 'chromium',
      grepInvert: /(@mobile|@tablet)(\s|$)/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      grepInvert: /(@mobile|@tablet)(\s|$)/,
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'mobile-chrome',
      grepInvert: /(@tablet|@tablet-and-desktop|@desktop)(\s|$)/,
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'tablet-safari',
      grepInvert: /(@mobile|@desktop)(\s|$)/,
      use: {
        ...devices['iPad (gen 7)'],
      },
    },
  ],
  reporter: [
    [process.env.CI ? 'github' : 'line'],
    ['html', { outputFolder: './e2e/output/html/', open: 'never' }],
  ],
  retries: process.env.CI ? 1 : 0,
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}--{projectName}{ext}',
  testDir: './e2e/tests',
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:8080',
    trace: process.env.PLAYWRIGHT_TRACE
      ? 'retain-on-failure'
      : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    storageState: {
      // @ts-expect-error The options have been marked as mandatory however the except the same arguments as https://playwright.dev/docs/api/class-browsercontext#browser-context-add-cookies
      cookies: [{
        name: 'cookie_preference',
        value: 'false',
        expires: Date.now() / 1000 + 1000 * 60 * 60,
        domain: 'localhost',
        path: '/',
      }],
    },
  },
  webServer: {
    command: process.env.CI ? 'npm exec --no -- serve -l 8080 dist' : 'npm start',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
  },
  workers: process.env.CI ? 2 : undefined,
}
export default config
