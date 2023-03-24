import { join } from 'node:path'
import { compileAsync } from 'sass'

export async function getColours() {
  const { css } = await compileAsync(join(__dirname, 'getColours.scss'), {
    quietDeps: true,
    loadPaths: ['node_modules'],
  })
  const matches = [...css.matchAll(/--(?<name>[a-z-]+): (?<value>[#a-f0-9]+)/g)]
  const entries = matches.flatMap(({ groups }) => (groups ? [[groups.name, groups.value]] : []))
  return Object.fromEntries(entries)
}
