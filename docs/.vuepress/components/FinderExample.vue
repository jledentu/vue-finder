<template>
  <Finder :tree="tree" :itemComponent="itemComponent" v-bind="$props" />
</template>
<script>
import { Finder } from "../../../dist/vue-finder.esm.js";

export default {
  name: "FinderExample",
  components: {
    Finder
  },
  props: ["selectable", "filter", "dragEnabled", "useCustomItemComponent"],
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
      }
    };
  },
  computed: {
    itemComponent() {
      if (this.useCustomItemComponent) {
        return {
          props: ["item"],
          template:
            '<div style="color: blue"><em>Name:</em> <strong>{{ item.label }}</strong></div>'
        };
      } else {
        return undefined;
      }
    }
  }
};
</script>

<style src="../../../dist/vue-finder.css" />

<style lang="scss" scoped>
.tree-container {
  margin: 20px 0;
  min-height: 250px;
}
</style>
