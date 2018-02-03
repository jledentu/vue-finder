import { storiesOf } from "@storybook/vue";

const MAX_DEPTH = 4;
const CHILDREN_NUMBER = 10;

function createChildren(parentId, parentLabel, parentIndex, parentDepth) {
  return Array.from({ length: CHILDREN_NUMBER }).map((child, idx) => ({
    id: `${parentId}-${idx + 1}`,
    label: `${parentLabel} > ${idx + 1}`,
    children:
      parentDepth < MAX_DEPTH
        ? createChildren(
            `${parentId}-${idx + 1}`,
            `${parentLabel} > ${idx + 1}`,
            idx,
            parentDepth + 1
          )
        : []
  }));
}

const data = {
  selected: "test-1-1",
  tree: {
    id: "test",
    label: "Test",
    children: createChildren("test", "Test", 0, 0)
  }
};

// Add more stories here to live develop your components
storiesOf("Finder", module).add("story as a template", () => ({
  template: `<Finder :tree="tree" :selected="selected"></Finder>`,
  data: function() {
    return data;
  }
}));
