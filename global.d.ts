export {}

declare global {
  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T> {
      toHaveNoViolations(disabledRules?: string[], excludedElements?: string[]): Promise<void>
    }
  }

  interface Window {
    googleTagId: string
    dataLayer: Record<string, string | Record<string, string>>[]
  }
}
