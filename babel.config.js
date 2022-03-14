module.exports = {
  presets: [["@babel/preset-env"], "@vue/babel-preset-jsx"],
  env: {
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: 10,
            },
          },
        ],
      ],
      plugins: ["transform-es2015-modules-commonjs"],
    },
  },
};
