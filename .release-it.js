const commitlintConfig = require('./commitlint.config')

module.exports = {
  git: {
    commit: false,
    push: false,
    requireBranch: 'main',
    requireCommits: true,
    tagName: 'v${version}',
  },
  github: {
    release: true,
    releaseName: 'v${version}',
  },
  npm: false,
  hooks: {
    'before:github:release': 'git push origin v${version}',
  },
  plugins: {
    '@release-it/conventional-changelog': {
      parserOpts: commitlintConfig.parserPreset.parserOpts,
      preset: {
        name: 'conventionalcommits',
        types: [
          {
            type: 'feat',
            section: 'Features',
          },
          {
            type: 'fix',
            section: 'Bug fixes',
          },
          {
            type: 'perf',
            section: 'Performance',
          },
          {
            type: 'revert',
            section: 'Reversions',
          },
          {
            type: 'deps',
            section: 'Dependencies',
          },
          {
            type: 'build',
            section: 'Internal changes',
          },
          {
            type: 'chore',
            section: 'Internal changes',
          },
          {
            type: 'deps-dev',
            section: 'Internal changes',
          },
          {
            type: 'style',
            section: 'Internal changes',
          },
          {
            type: 'refactor',
            section: 'Internal changes',
          },
          {
            type: 'docs',
            section: 'Documentation',
            hidden: 'true',
          },
          {
            type: 'release',
            section: 'Releases',
            hidden: 'true',
          },
          {
            type: 'test',
            section: 'Testing',
            hidden: 'true',
          },
          {
            type: 'ci',
            section: 'Continuous integration',
            hidden: 'true',
          },
        ],
      },
    },
  },
}
