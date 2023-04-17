module.exports = {
  env: {
    browser: false,
    es6: true,
    jest: true,
    node: true
  },
  extends: ['airbnb-base', 'plugin:jest/all'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['jest'],
  rules: {
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
