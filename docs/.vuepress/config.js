import { path } from "@vuepress/utils";
import { defaultTheme, defineUserConfig } from "vuepress";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";

export default defineUserConfig({
  title: "Vue Finder",
  description: "A Vue.js component to display hierarchical data",
  theme: defaultTheme({
    navbar: [
      { text: "GitHub", link: "https://github.com/jledentu/vue-finder" },
    ],
    sidebar: ["/getting-started", "/examples", "/customization", "/api"],
    displayAllHeaders: true,
    logo: "/logo.svg",
  }),
  plugins: [
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, "./components"),
    }),
  ],
});
