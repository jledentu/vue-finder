const { path } = require("@vuepress/utils");

module.exports = {
  title: "Vue Finder",
  description: "A Vue.js component to display hierarchical data",
  themeConfig: {
    nav: [{ text: "GitHub", link: "https://github.com/jledentu/vue-finder" }],
    sidebar: ["/getting-started", "/examples", "/customization", "/api"],
    displayAllHeaders: true,
    logo: "/logo.svg",
  },
  plugins: [
    [
      "@vuepress/register-components",
      {
        componentsDir: path.resolve(__dirname, "./components"),
      },
    ],
  ],
};
