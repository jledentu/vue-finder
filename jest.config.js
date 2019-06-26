const path = require("path");

module.exports = {
  rootDir: path.resolve(__dirname, "./"),
  moduleFileExtensions: ["js", "json", "vue"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    ".*\\.js$": require.resolve("babel-jest"),
    ".*\\.vue$": require.resolve("vue-jest")
  },
  transformIgnorePatterns: ["/node_modules/(?!lodash-es)/"],
  snapshotSerializers: [require.resolve("jest-serializer-vue")],
  setupFiles: ["<rootDir>/jest.setup"],
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "src/**/*.{js,vue}",
    "!src/index.js",
    "!src/index.umd.js",
    "!**/node_modules/**"
  ]
};
