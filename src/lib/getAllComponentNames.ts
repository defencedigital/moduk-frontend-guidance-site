import { globSync } from 'glob'
import { basename, dirname, join } from 'node:path'

export function getAllComponentNames() {
  const modukFrontendLibPath = dirname(require.resolve('@moduk/frontend'))
  const glob = join(modukFrontendLibPath, '../nunjucks/moduk/components/*/macro.njk')
  const paths = globSync(glob, { windowsPathsNoEscape: true })
  return paths.map((path) => basename(dirname(path)))
}
