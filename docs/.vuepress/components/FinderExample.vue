<template>
  <Finder :tree="tree" v-bind="$props" />
</template>
<script>
import { Finder } from "../../../dist/vue-finder.esm.js";

export default {
  name: "FinderExample",
  components: {
    Finder
  },
  props: ["selectable", "filter", "dragEnabled"],
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
