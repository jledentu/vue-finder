const path = require("path");
const { loadConfigFromFile, mergeConfig } = require("vite");
const vueJsx = require("@vitejs/plugin-vue-jsx");

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],

  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },

  async viteFinal(config) {
    const { config: userConfig } = await loadConfigFromFile(
      path.resolve(__dirname, "../vite.config.js"),
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

  docs: {
    autodocs: true,
  },
};
