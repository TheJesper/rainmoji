// .eslintrc.js v0.0.1
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  settings: {
    react: { version: "detect" },
  },
};
