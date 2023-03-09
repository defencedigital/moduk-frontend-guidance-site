import { globSync } from 'glob'
import { basename, dirname, join } from 'node:path'

export function getAllComponentNames() {
  const modukFrontendLibPath = dirname(require.resolve('@moduk/frontend'))
  const paths = globSync(join(modukFrontendLibPath, 'nunjucks/moduk/components/*/macro.njk'))
  return paths.map((path) => basename(dirname(path)))
}
