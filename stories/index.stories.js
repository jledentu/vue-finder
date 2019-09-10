import { storiesOf } from "@storybook/vue";
import { withKnobs, text } from "@storybook/addon-knobs";

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

const data = {
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

const filterMixin = {};

// Add more stories here to live develop your components
storiesOf("Finder", module)
  .addDecorator(withKnobs)
  .add("With a lot of items", () => ({
    props: {
      filter: {
        default: text("Filter", "")
      }
    },
    computed: {
      filterFunction() {
        const filterString = this.filter;
        return item => RegExp(`^${filterString}.*`, "gi").test(item.label);
      }
    },
    template: `<Finder :tree="tree" style="height: 100%" :filter="filterFunction"></Finder>`,
    created() {
      this.tree = {
        id: "test",
        label: "Test",
        children: createChildren("test", "Test", 0, 0)
      };
    }
  }))
  .add("Selectable items", () => ({
    props: {
      filter: {
        default: text("Filter", "")
      }
    },
    computed: {
      filterFunction() {
        const filterString = this.filter;
        return item => RegExp(`^${filterString}.*`, "gi").test(item.label);
      }
    },
    template: `<Finder :tree="tree" :selectable="true" style="height: 100%" :filter="filterFunction"></Finder>`,
    created() {
      this.tree = data;
    }
  }))
  .add("Drag and drop", () => ({
    mixins: [filterMixin],
    template: `<Finder :tree="tree" :drag-enabled="true" style="height: 100%"></Finder>`,
    created() {
      this.tree = data;
    }
  }))
  .add("Custom item component", () => ({
    mixins: [filterMixin],
    template: `<Finder :tree="tree" :item-component="itemComponent" :selectable="true" :drag-enabled="true" style="height: 100%"></Finder>`,
    created() {
      this.tree = data;
      this.itemComponent = {
        props: ["item"],
        template:
          '<div style="color: blue"><em>Name:</em> <strong>{{ item.label }}</strong></div>'
      };
    }
  }))
  .add("Custom theme", () => ({
    mixins: [filterMixin],
    computed: {
      theme() {
        return {
          primaryColor: "#41b883",
          arrowColor: "#555",
          separatorColor: "#eee",
          separatorWidth: "3px",
          dropZoneBgColor: "rgba(112, 195, 112, 0.3)",
          draggedItemBgColor: "rgba(112, 195, 112, 0.6)"
        };
      }
    },
    template: `<Finder :tree="tree" :theme="theme" :selectable="true" :drag-enabled="true" style="height: 100%"></Finder>`,
    created() {
      this.tree = data;
    }
  }));
