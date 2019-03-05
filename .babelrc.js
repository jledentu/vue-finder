const path = require("path");

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false
      }
    ],
    "@vue/babel-preset-jsx"
  ],
  env: {
    test: {
      presets: ["@babel/preset-env"]
    }
  }
};
