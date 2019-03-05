const path = require("path");

module.exports = (baseConfig, env, defaultConfig) => {
  // Add js, json and vue extension support
  defaultConfig.resolve.extensions.push(".js", ".vue", ".json");

  // Add alias for @ pointing to src
  defaultConfig.resolve.alias["@"] = path.resolve("src");

  // Add SCSS preprocessing
  defaultConfig.module.rules.push({
    test: /\.scss$/,
    loaders: ["style-loader", "css-loader", "sass-loader"],
    include: path.resolve(__dirname, "../src/")
  });

  return defaultConfig;
};
