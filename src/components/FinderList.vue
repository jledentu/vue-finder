<template>
  <div class="list">
    <component
      v-for="item in items"
      :is="itemComponent"
      :selected="item.id === selectedId"
      v-on:click.native="selectItem(item.id)">{{item.label}}</component>
  </div>
</template>

<script>
import FinderItem from "./FinderItem.vue";

export default {
  name: "FinderList",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemComponent: {
      default: () => FinderItem
    },
    selectedId: {
      type: String
    }
  },
  components: {
    FinderItem
  },
  methods: {
    selectItem(id) {
      this.$emit("item-selected", id);
    }
  }
};
</script>

<style lang="less" scoped>
.list {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  height: 100%;
  border-right: solid 1px gray;
  overflow: auto;
}
</style>
