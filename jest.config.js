const path = require("path");

module.exports = {
  rootDir: path.resolve(__dirname, "./"),
  moduleFileExtensions: ["js", "json", "vue"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    ".*\\.js$": require.resolve("babel-jest"),
    ".*\\.vue$": require.resolve("@vue/vue3-jest"),
  },
  transformIgnorePatterns: ["/node_modules/(?!lodash-es)/"],
  snapshotSerializers: [require.resolve("jest-serializer-vue")],
  //setupFiles: ["<rootDir>/jest.setup"],
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "src/**/*.{js,vue}",
    "!src/index.js",
    "!**/node_modules/**",
  ],
  testEnvironment: "jsdom",
};
