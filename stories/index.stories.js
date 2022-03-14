import Finder from "../src/components/Finder";

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
      selectable: false,
      children: [
        {
          id: "chili",
          label: "Chilli Peppers",
          children: [
            {
              id: "chilli dutch red",
              label: "Dutch red"
            },
            {
              id: "chilli south american yellow",
              label: "South American yellow",
              selected: true
            }
          ]
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
        },
        {
          id: "bean",
          label: "Beans"
        }
      ]
    },
    {
      id: "meat",
      label: "Meats",
      selectable: true,
      children: [
        {
          id: "pork",
          label: "Pork"
        },
        {
          id: "seafood",
          label: "Seafood",
          selectable: false
        },
        {
          id: "chicken",
          label: "Chicken",
          selected: true
        }
      ]
    }
  ]
};

export default {
  title: "Finder",
  component: Finder,
  argTypes: {
    filter: { control: "text" }
  }
};

const Template = (args, { argTypes, loaded: { loadedTree } }) => ({
  components: { Finder },
  props: Object.keys(argTypes),
  template: `<Finder
    style="height: 100%"
    v-bind="$props"
    :filter="filterFunction" />`,
  computed: {
    filterFunction() {
      if (!this.filter) {
        return undefined;
      }
      const filterString = this.filter;
      return item => RegExp(`^${filterString}.*`, "gi").test(item.label);
    }
  },
  created() {
    if (loadedTree) {
      this.tree = loadedTree;
    }
  }
});

const defaultArgs = {
  tree: data,
  selectable: false,
  autoSelectDescendants: false,
  autoDeselectDescendants: false,
  dragEnabled: false,
  hasDragHandle: false,
  filter: "",
  defaultExpanded: ""
};

export const LotOfItems = Template.bind({});
LotOfItems.args = {
  ...defaultArgs,
  tree: null
};
LotOfItems.loaders = [
  async () => ({
    loadedTree: {
      id: "test",
      label: "Test",
      children: createChildren("test", "Test", 0, 0)
    }
  })
];
LotOfItems.storyName = "With a lot of items";

export const Selectable = Template.bind({});
Selectable.args = {
  ...defaultArgs,
  selectable: true
};
Selectable.storyName = "Selectable items";

export const DragAndDrop = Template.bind({});
DragAndDrop.args = {
  ...defaultArgs,
  dragEnabled: true,
  dragImageComponent: {
    props: ["item"],
    template: `<div style="background-color: white; display: flex; align-items: center; padding: 10px; border: solid 1px #ddd">
        Dragging {{ item.label }}
      </div>`
  }
};
DragAndDrop.storyName = "Drag and Drop";

export const CustomItemComponent = Template.bind({});
CustomItemComponent.args = {
  ...defaultArgs,
  selectable: true,
  dragEnabled: true,
  hasDragHandle: true,
  itemComponent: {
    props: ["item", "dragged", "expanded"],
    template:
      '<div :style="{color: expanded ? `white` : `blue`}"><em>Name:</em> <strong>{{ item.label }}</strong></div>'
  }
};
CustomItemComponent.storyName = "Custom item component";

export const CustomArrowComponent = Template.bind({});
CustomArrowComponent.args = {
  ...defaultArgs,
  arrowComponent: {
    template: "<div>-></div>"
  }
};
CustomArrowComponent.storyName = "Custom arrow component";

export const CustomDropZoneComponent = Template.bind({});
CustomDropZoneComponent.args = {
  ...defaultArgs,
  dragEnabled: true,
  dropZoneComponent: {
    props: ["item", "dragging", "dragOver"],
    template:
      '<div style="padding: 5px; color: blue; text-align: center"><span v-if="dragOver">Drop here</span></div>'
  }
};
CustomDropZoneComponent.storyName = "Custom drop zone component";

export const CustomTheme = Template.bind({});
CustomTheme.args = {
  ...defaultArgs,
  selectable: true,
  dragEnabled: true,
  theme: {
    primaryColor: "#41b883",
    arrowColor: "#555",
    separatorColor: "#eee",
    separatorWidth: "3px",
    dropZoneBgColor: "rgba(112, 195, 112, 0.3)",
    draggedItemBgColor: "rgba(112, 195, 112, 0.6)"
  }
};
CustomTheme.storyName = "Custom theme";
