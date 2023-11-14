module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:react/jsx-runtime'
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'import', 'simple-import-sort', 'hooks'],
  rules: {
    eqeqeq: ['error', 'always'],
    '@typescript-eslint/no-empty-function': ['warn', { allow: ['arrowFunctions'] }],
    '@typescript-eslint/triple-slash-reference': ['off'],
    'react/self-closing-comp': ['error'],
    'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
    'react/hook-use-state': ['warn'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never', propElementValues: 'always' }],
    'react/jsx-fragments': ['warn', 'syntax'],
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        shorthandFirst: false,
        shorthandLast: false,
        multiline: 'ignore',
        ignoreCase: true,
        noSortAlphabetically: false,
        reservedFirst: false,
        locale: 'en'
      }
    ],
    'react/no-unused-state': ['error'],
    'react/function-component-definition': [
      'error',
      { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' }
    ],
    'react-hooks/rules-of-hooks': ['error'],
    'react-hooks/exhaustive-deps': ['warn'],
    'import/extensions': ['error', 'never', {ignorePackages: true}],
    'import/first': ['error'],
    'import/newline-after-import': ['error'],
    'import/no-extraneous-dependencies': ['error'],
    'import/no-duplicates': ['error'],
    // 'import/no-unused-modules': ['warn', { unusedExports: true }],
    'import/no-absolute-path': ['error'],
    'import/no-default-export': ['error'],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^react'], // React
          ['^@?\\w'], // others
          [('^\\.\\.(?!/?$)', '^\\.\\./?$')], // Parent imports
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Sibling
        ]
      }
    ],
    'hooks/sort': [
      'warn',
      {
        groups: [
          'useQuery',
          'useState',
          'useRef',
          'useEffect'
        ]
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
    }
  }
}
