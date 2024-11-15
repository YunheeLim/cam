module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'prettier', 'prettier-plugin-tailwindcss'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
    // "react/react-in-jsx-scope": "off",
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    semi: 'error',
  },
  parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   ecmaVersion: 'latest',
  //   sourceType: 'module',
  //   ecmaFeatures: {
  //     jsx: true,
  //     js: true,
  //     tsx: true,
  //     ts: true,
  //   },
  // },
};
