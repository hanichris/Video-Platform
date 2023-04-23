module.exports = {
  settings: {
    react: {
      version: 'detect'
    }
  },
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: [
    'airbnb-base',
    'plugin:jest/all',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      tsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
    // project: 'tsconfig.json',
  },
  plugins: ['jest', 'react', '@typescript-eslint'],
  rules: {
    'max-classes-per-file': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'no-shadow': 'off',
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    // you should turn the original rule off *only* for test files
    '@typescript-eslint/unbound-method': 'off',
    'jest/unbound-method': 'off'
  },
  overrides: [
    {
      files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
      excludedFiles: ['babel.config.js', 'vite.config.ts']
    }
  ]
};
