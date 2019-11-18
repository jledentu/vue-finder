import { configure, addDecorator } from "@storybook/vue";
import Vue from "vue";
import { withA11y } from "@storybook/addon-a11y";

addDecorator(withA11y);

// Import your custom components.
import ModuleLibrary from "@/index";

// Install this library
Vue.use(ModuleLibrary);

// Install Vue plugins
// ex: Vue.use(vuex)

// Load stories
const req = require.context("../stories", true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}
configure(loadStories, module);
