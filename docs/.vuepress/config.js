const path = require("path");
module.exports = {
  title: "Vue Finder",
  description: "A Vue.js component to display hierarchical data",
  themeConfig: {
    nav: [{ text: "GitHub", link: "https://github.com/jledentu/vue-finder" }],
    sidebar: ["/getting-started", "/examples", "/customization", "/api"],
    displayAllHeaders: true,
    logo: "/logo.svg"
  },
  configureWebpack: (config, isServer) => {
    if (!isServer) {
      const babelRule = config.module.rules.find(({ use }) =>
        use.some(({ loader }) => loader === "babel-loader")
      );
      const exclude = babelRule.exclude;
      babelRule.exclude.push(/node_modules/);

      config.resolve.alias.vue = "vue/dist/vue.common.js";
    }
  }
};
