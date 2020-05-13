import { storiesOf } from "@storybook/vue";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";

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
          id: "orange",
          label: "Orange",
          selected: true
        },
        {
          id: "apple",
          label: "Apple",
          selectable: false
        },
        {
          id: "grape",
          label: "Grape",
          selected: true
        },
        {
          id: "banana",
          label: "Banana"
        },
        {
          id: "lemon",
          label: "Lemon",
          selectable: false
        }
      ]
    },
    {
      id: "vegetables",
      label: "Vegetables",
      children: [
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
        },
        {
          id: "bean",
          label: "Beans"
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
        if (!this.filter) {
          return undefined;
        }
        const filterString = this.filter;
        return item => RegExp(`^${filterString}.*`, "gi").test(item.label);
      },
      sortBy() {
        return (item1, item2) => item1.label.localeCompare(item2.label);
      }
    },
    template: `<Finder :tree="tree" :selectable="true" style="height: 100%" :filter="filterFunction" :sortBy="sortBy"></Finder>`,
    created() {
      this.tree = data;
    }
  }))
  .add("Drag and drop", () => ({
    props: {
      hasDragHandle: {
        type: Boolean,
        default: boolean("Show drag handle", false)
      }
    },
    mixins: [filterMixin],
    template: `<Finder :tree="tree" :drag-enabled="true" :can-drop="canDrop" :has-drag-handle="hasDragHandle" style="height: 100%"></Finder>`,
    created() {
      this.tree = data;
      this.canDrop = target => {
        return target !== "tomato";
      };
    }
  }))
  .add("Custom drag image component", () => ({
    mixins: [filterMixin],
    template: `<Finder :tree="tree" :drag-enabled="true" :drag-image-component="dragImageComponent" style="height: 100%"></Finder>`,
    created() {
      this.tree = data;
      this.dragImageComponent = {
        props: ["item"],
        template: `<div style="background-color: white; display: flex; align-items: center; padding: 10px; border: solid 1px #ddd">
            Dragging {{ item.label }}
          </div>`
      };
    }
  }))
  .add("Custom item component", () => ({
    mixins: [filterMixin],
    template: `<Finder :tree="tree" :item-component="itemComponent" :selectable="true" :drag-enabled="true" :has-drag-handle="true" style="height: 100%"></Finder>`,
    created() {
      this.tree = data;
      this.itemComponent = {
        props: ["item", "dragged", "expanded"],
        template:
          '<div :style="{color: expanded ? `white` : `blue`}"><em>Name:</em> <strong>{{ item.label }}</strong></div>'
      };
    }
  }))
  .add("Custom arrow component", () => ({
    mixins: [filterMixin],
    template: `<Finder :tree="tree" :arrow-component="arrowComponent" style="height: 100%"></Finder>`,
    created() {
      this.tree = data;
      this.arrowComponent = {
        template: "<div>-></div>"
      };
    }
  }))
  .add("Custom drop zone component", () => ({
    mixins: [filterMixin],
    template: `<Finder :tree="tree" :drop-zone-component="dropZoneComponent" :drag-enabled="true" style="height: 100%"></Finder>`,
    created() {
      this.tree = data;
      this.dropZoneComponent = {
        props: ["item", "dragging", "dragOver"],
        template:
          '<div style="padding: 5px; color: blue; text-align: center"><span v-if="dragOver">Drop here</span></div>'
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
