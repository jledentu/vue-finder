import Finder from "../src/components/Finder.vue";

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
              parentDepth + 1,
            )
          : [],
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
          selected: true,
        },
        {
          id: "apple",
          label: "Apple",
          selectable: false,
        },
        {
          id: "grape",
          label: "Grape",
          selected: true,
        },
        {
          id: "banana",
          label: "Banana",
        },
        {
          id: "lemon",
          label: "Lemon",
          selectable: false,
        },
      ],
    },
    {
      id: "vegetables",
      label: "Vegetables",
      children: [
        {
          id: "carrot",
          label: "Carrot",
          selected: true,
        },
        {
          id: "eggplant",
          label: "Eggplant",
          selectable: false,
        },
        {
          id: "parsnip",
          label: "Parsnip",
        },
        {
          id: "tomato",
          label: "Tomato",
          selectable: false,
        },
        {
          id: "bean",
          label: "Beans",
        },
      ],
    },
  ],
};

export default {
  title: "Finder",
  component: Finder,
  argTypes: {
    filter: { control: "text" },
    onExpand: { action: "expand" },
    onMove: { action: "move" },
    onSelect: { action: "select" },
  },
};

const Template = (args, { loaded: { loadedTree } }) => ({
  components: { Finder },
  setup() {
    return { args, loadedTree };
  },
  template: `<Finder
    v-if="args.tree || loadedTree"
    style="height: 100%"
    v-bind="{ ...args, tree: args.tree || loadedTree, filter: filterFunction }">
      <template v-if="args.useItemSlot" #item="{ item, expanded }">
        <div :style="{color: expanded ? 'white' : 'blue'}"><em>Name:</em> <strong>{{ item.label }}</strong></div>
      </template>
      <template v-if="args.useArrowSlot" #arrow="{ expanded }">
        <div>
          {{ expanded ? '-->' : '->' }}
        </div>
      </template>
      <template v-if="args.useDropZoneSlot" #drop-zone="{ dragOver }">
        <div style="padding: 5px; color: blue; text-align: center"><span v-if="dragOver">Drop here</span></div>
      </template>
      <template v-if="args.useDragImageSlot" #drag-image="{ item }">
        <div>Dragging {{item.label}} </div>
      </template>
  </Finder>`,
  computed: {
    filterFunction() {
      if (!this.filter) {
        return undefined;
      }
      const filterString = this.filter;
      return (item) => RegExp(`^${filterString}.*`, "gi").test(item.label);
    },
  },
});

const defaultArgs = {
  tree: data,
  selectable: false,
  autoSelectDescendants: false,
  autoDeselectDescendants: false,
  dragEnabled: false,
  hasDragHandle: false,
  filter: "",
  defaultExpanded: "",
};

export const LotOfItems = Template.bind({});
LotOfItems.args = {
  ...defaultArgs,
  tree: null,
};
LotOfItems.loaders = [
  async () => ({
    loadedTree: {
      id: "test",
      label: "Test",
      children: createChildren("test", "Test", 0, 0),
    },
  }),
];
LotOfItems.storyName = "With a lot of items";

export const Selectable = Template.bind({});
Selectable.args = {
  ...defaultArgs,
  selectable: true,
};
Selectable.storyName = "Selectable items";

export const DragAndDrop = Template.bind({});
DragAndDrop.args = {
  ...defaultArgs,
  dragEnabled: true,
};
DragAndDrop.storyName = "Drag and Drop";

export const CustomItemSlot = Template.bind({});
CustomItemSlot.args = {
  ...defaultArgs,
  selectable: true,
  dragEnabled: true,
  hasDragHandle: true,
  useItemSlot: true,
};
CustomItemSlot.storyName = "Custom item slot";

export const CustomArrowSlot = Template.bind({});
CustomArrowSlot.args = {
  ...defaultArgs,
  useArrowSlot: true,
};
CustomArrowSlot.storyName = "Custom arrow slot";

export const CustomDropZoneSlot = Template.bind({});
CustomDropZoneSlot.args = {
  ...defaultArgs,
  dragEnabled: true,
  useDropZoneSlot: true,
};
CustomDropZoneSlot.storyName = "Custom drop zone slot";

export const CustomDragImageSlot = Template.bind({});
CustomDragImageSlot.args = {
  ...defaultArgs,
  dragEnabled: true,
  useDragImageSlot: true,
};
CustomDragImageSlot.storyName = "Custom drag image slot";

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
    draggedItemBgColor: "rgba(112, 195, 112, 0.6)",
  },
};
CustomTheme.storyName = "Custom theme";
