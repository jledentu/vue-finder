const path = require("path");
const { loadConfigFromFile, mergeConfig } = require("vite");
const vueJsx = require("@vitejs/plugin-vue-jsx");

module.exports = {
  core: {
    builder: "@storybook/builder-vite",
  },
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/vue3",
  async viteFinal(config) {
    const { config: userConfig } = await loadConfigFromFile(
      path.resolve(__dirname, "../vite.config.js")
    );

    return {
      ...config,
      define: {
        ...config.define,
        global: "window",
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          "@": path.resolve("src"),
        },
      },
      plugins: [...config.plugins, vueJsx()],
    };
  },
};
