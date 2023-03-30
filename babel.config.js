module.exports = {
  presets: [["@babel/preset-env"]],
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
      plugins: ["transform-es2015-modules-commonjs", "@vue/babel-plugin-jsx"],
    },
  },
};
