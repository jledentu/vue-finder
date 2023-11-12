// https://eslint.org/docs/user-guide/configuring
const path = require("path");

module.exports = {
  root: true,
  parserOptions: {
    parser: "@babel/eslint-parser",
    babelOptions: {
      parserOpts: {
        plugins: ["jsx"],
      },
    },
    ecmaVersion: 2017,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  plugins: ["html", "vue"],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:storybook/recommended",
  ],
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  rules: {
    // allow async-await
    "generator-star-spacing": "off",
    // don't require .vue extension when importing
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
      },
    ],
    "no-unused-vars": ["error", { ignoreRestSiblings: true }],
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/html-indent": "off",
    "vue/html-self-closing": "off",
    "vue/max-attributes-per-line": "off",
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["Finder"],
      },
    ],
  },
  settings: {
    "import/resolver": {
      "eslint-import-resolver-custom-alias": {
        extensions: [".js", ".vue", ".json"],
        alias: {
          "@": path.resolve("src"),
        },
      },
    },
  },
};
