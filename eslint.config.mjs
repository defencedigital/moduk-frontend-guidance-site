import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import { configs, plugin } from 'typescript-eslint'

export default defineConfig(
  {
    ignores: [
      '**/dist/',
      '/e2e/output/',
      '!.*',
    ],
  },
  js.configs.recommended,
  comments.recommended,
  configs.recommended,
  configs.stylistic,
  {
    plugins: {
      '@typescript-eslint': plugin,
      eslintPluginUnicorn,
    },
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    languageOptions: {
      globals: {
        browser: true,
        ...globals.node,
        es2021: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
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
      'eslintPluginUnicorn/prefer-node-protocol': 'error',
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
  },
)
