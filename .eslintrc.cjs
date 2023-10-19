module.exports = {
    env: { browser: true, es2020: true },
    extends: [
      'airbnb-base',
      'airbnb-typescript/base',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: ['./tsconfig.json'],
    },
    plugins: ['react-refresh', 'import'],
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }
      },
      'react': {
        version: 'detect'
      }
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/ban-types': [
        'error',
        {
          extendDefaults: true,
          types: {
            '{}': false,
          },
        },
      ],
      'react/jsx-filename-extension': [
        2,
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'import/no-named-as-default': 0
    },
  }
  