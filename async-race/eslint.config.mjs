import eslintPluginTypescript from '@typescript-eslint/eslint-plugin'
import eslintParserTypescript from '@typescript-eslint/parser'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import stylisticJs from '@stylistic/eslint-plugin-js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['.config/', 'dist/', 'tsconfig.json', 'node_modules', '*.config.js'],
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: eslintParserTypescript,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
      unicorn: eslintPluginUnicorn,
      prettier: eslintPluginPrettier,
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: { constructors: 'off' },
        },
      ],
      '@typescript-eslint/member-ordering': 'error',
      'class-methods-use-this': 'error',
      'prettier/prettier': 'error',
      '@stylistic/js/line-comment-position': ["warn", { "position": "beside", "ignorePattern": "\\s*#(endregion|region)"}],
      'max-lines-per-function': ['error', { max: 40, skipComments: true, skipBlankLines: true }],
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [0, 1],
          ignoreEnums: true,
          ignoreReadonlyClassProperties: true,
          ignoreArrayIndexes: true,
          enforceConst: true,
          detectObjects: false
        }
      ],
    },
  },
]
