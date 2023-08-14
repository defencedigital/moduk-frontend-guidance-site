module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'unicorn',
  ],
  rules: {
    'comma-dangle': 'off',
    'eol-last': 'off',
    'func-call-spacing': 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        'e2e/**',
        '.eleventy.js',
        '*.config.{cjs,js,mjs,ts,mts}',
        'src/lib/**',
        'src/site/_data/**',
        'src/site/**/*.11tydata.js',
        'vitest/**',
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/*.spec.ts',
      ],
      optionalDependencies: false,
    }],
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
    'import/prefer-default-export': 'off',
    indent: 'off',
    'max-len': 'off',
    'no-spaced-func': 'off',
    'object-curly-newline': 'off',
    'operator-linebreak': 'off',
    semi: ['error', 'never'],
    'semi-style': 'off',
    'unicorn/prefer-node-protocol': 'error',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: '.',
      },
    },
  },
}
