const path = require("path");
const doT = require("dot");
doT.templateSettings.strip = false;
const templates = doT.process({ path: "./docs/templates" });

module.exports = {
  componentsRoot: "src/components",
  //getDestFile: (file: string, config: DocgenCLIConfig) => path.join(config.outDir, file).replace(/\.vue$/ ".doc.md"),
  components: "**/Finder.vue", // the glob to define what files should be documented as components (relative to componentRoot)
  apiOptions: {
    jsx: true // tell vue-docgen-api that your components are using JSX to avoid conflicts with TypeScript <type> syntax
  },
  getDestFile: (file, config) => path.join(config.outDir, "api.md"),
  templates: {
    component: (renderedUsage, doc) =>
      templates.component({ renderedUsage, doc }),
    props: props => templates.props({ props }),
    events: events => templates.events({ events }),
    methods: methods => templates.methods({ methods })
  }
};
