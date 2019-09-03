module.exports = function component(
  renderedUsage, // props, events, methods and slots documentation rendered
  doc, // the object returned by vue-docgen-api
  config, // the local config, useful to know the context
  fileName // the name of the current file in the doc (to explain how to import it)
) {
  const { displayName, description, docsBlocks } = doc;
  return `
  # API

  ${description ? "> " + description : ""}

  ${renderedUsage.props}
  ${renderedUsage.methods}
  ${renderedUsage.events}
  ${renderedUsage.slots}
  ${docsBlocks ? "---\n" + docsBlocks.join("\n---\n") : ""}
  `;
};
