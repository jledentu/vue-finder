<template>
  <div class="list">
    <component
      :is="itemComponent"
      v-for="item in items"
      :key="item.id"
      :expanded="expanded.includes(item.id)"
      @click.native="selectItem(item.id)"
    >
      {{ item.label }}
    </component>
  </div>
</template>

<script>
import FinderItem from "./FinderItem";

export default {
  name: "FinderList",
  components: {
    FinderItem
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemComponent: {
      type: Object,
      default: () => FinderItem
    },
    expanded: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem(id) {
      this.$emit("item-selected", id);
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  height: 100%;
  border-right: solid 1px gray;
  overflow: auto;
}
</style>
