module.exports = {
  env: {
    browser: false,
    es6: true,
    jest: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  plugins: ['jest', '@typescript-eslint'],
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/resolver': {
      typescript: {
        directory: './tsconfig.json'
      },
      node: {
        extensions: ['.js', '.ts']
      }
    }
  },
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    semi: [2, 'always'],
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-unused-expressions': ['off'],
    'import/extensions': [
      2,
      'ignorePackages',
      {
        '': 'never',
        js: 'never',
        ts: 'never'
      }
    ],
    'no-console': 'off',
    'no-shadow': 'off',
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement']
  },
  overrides: [
    {
      files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
      excludedFiles: 'babel.config.js'
    }
  ]
};
