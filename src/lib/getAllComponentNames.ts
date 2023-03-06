import glob from 'glob'
import { basename, dirname, join } from 'node:path'

export function getAllComponentNames() {
  const modukFrontendLibPath = dirname(require.resolve('@moduk/frontend'))
  const paths = glob.sync(join(modukFrontendLibPath, 'nunjucks/moduk/components/*/macro.njk'))
  return paths.map((path) => basename(dirname(path)))
}
