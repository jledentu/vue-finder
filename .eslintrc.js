// https://eslint.org/docs/user-guide/configuring
const path = require("path");

module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    extraFileExtensions: [".vue"],
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["@typescript-eslint", "html", "vue"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:prettier/recommended",
    "plugin:vue/recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    jest: true
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
        vue: "never"
      }
    ],
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/html-indent": "off",
    "vue/html-self-closing": "off",
    "vue/max-attributes-per-line": "off",
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
        vue: "never"
      }
    ]
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
      "vue-eslint-parser": [".vue"]
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true
      }
    },
    "import/extensions": [".js", ".ts", ".tsx", ".vue"]
  }
};
