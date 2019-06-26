module.exports = {
  presets: [["@babel/preset-env"], "@vue/babel-preset-jsx"],
  env: {
    test: {
      presets: ["@babel/preset-env"],
      plugins: ["transform-es2015-modules-commonjs"]
    }
  }
};
