module.exports = {
  moduleFileExtensions: ["js", "json", "vue"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "@vue/vue2-jest"
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
  ],
  testEnvironment: "jsdom"
};
