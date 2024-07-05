<template>
  <Finder :tree="tree" v-bind="$props">
    <template v-if="useCustomItemSlot" #item="{ item }">
      <div style="color: blue">
        <em>Name:</em> <strong>{{ item.label }}</strong>
      </div>
    </template>
    <template v-if="useCustomArrowSlot" #arrow="{ expanded }">
      <div>{{ expanded ? "↪" : "→" }}</div>
    </template>
  </Finder>
</template>
<script>
import { Finder } from "../../../dist/vue-finder.es.js";

export default {
  name: "FinderExample",
  components: {
    Finder,
  },
  props: [
    "selectable",
    "filter",
    "dragEnabled",
    "hasDragHandle",
    "useCustomItemSlot",
    "useCustomArrowSlot",
    "defaultExpanded",
  ],
  data() {
    return {
      tree: {
        id: "root",
        children: [
          {
            id: "fruits",
            label: "Fruits",
            children: [
              {
                id: "apple",
                label: "Apple",
                selectable: false,
                movable: true,
              },
              {
                id: "banana",
                label: "Banana",
                movable: true,
              },
              {
                id: "grape",
                label: "Grape",
                selected: true,
              },
              {
                id: "lemon",
                label: "Lemon",
                selectable: false,
              },
              {
                id: "orange",
                label: "Orange",
                selected: true,
              },
            ],
          },
          {
            id: "vegetables",
            label: "Vegetables",
            children: [
              {
                id: "bean",
                label: "Beans",
                movable: true,
              },
              {
                id: "carrot",
                label: "Carrot",
                selected: true,
                movable: true,
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
            ],
          },
        ],
      },
    };
  },
};
</script>

<style src="../../../dist/vue-finder.css" />

<style lang="scss" scoped>
.tree-container {
  margin: 20px 0;
  height: 250px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
