import { storiesOf } from "@storybook/vue";

const MAX_DEPTH = 4;
const CHILDREN_NUMBER = 10;

function createChildren(parentId, parentLabel, parentIndex, parentDepth) {
  const children = [];
  for (let index = 0; index < CHILDREN_NUMBER; index++) {
    children.push({
      id: `${parentId}-${index + 1}`,
      label: `${parentLabel} > ${index + 1}`,
      children:
        parentDepth < MAX_DEPTH
          ? createChildren(
              `${parentId}-${index + 1}`,
              `${parentLabel} > ${index + 1}`,
              index,
              parentDepth + 1
            )
          : []
    });
  }

  return children;
}

// Add more stories here to live develop your components
storiesOf("Finder", module)
  .add("With a lot of items", () => ({
    template: `<Finder :tree="tree" style="height: 100%"></Finder>`,
    created() {
      this.tree = {
        id: "test",
        label: "Test",
        children: createChildren("test", "Test", 0, 0)
      };
    }
  }))
  .add("Selectable items", () => ({
    template: `<Finder :tree="tree" :selectable="true" style="height: 100%"></Finder>`,
    created() {
      this.tree = {
        id: "test",
        label: "Test",
        children: [
          {
            id: "fruits",
            label: "Fruits",
            children: [
              {
                id: "apple",
                label: "Apple",
                selectable: false
              },
              {
                id: "banana",
                label: "Banana"
              },
              {
                id: "grape",
                label: "Grape",
                selected: true
              },
              {
                id: "lemon",
                label: "Lemon",
                selectable: false
              },
              {
                id: "orange",
                label: "Orange",
                selected: true
              }
            ]
          },
          {
            id: "vegetables",
            label: "Vegetables",
            children: [
              {
                id: "bean",
                label: "Beans"
              },
              {
                id: "carrot",
                label: "Carrot",
                selected: true
              },
              {
                id: "eggplant",
                label: "Eggplant",
                selectable: false
              },
              {
                id: "parsnip",
                label: "Parsnip"
              },
              {
                id: "tomato",
                label: "Tomato",
                selectable: false
              }
            ]
          }
        ]
      };
    }
  }));
