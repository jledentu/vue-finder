<template>
  <div class="item" :class="{ expanded: expanded }">
    <slot />
  </div>
</template>

<script>
export default {
  name: "FinderItem",
  props: {
    expanded: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  padding: 10px;
  width: 250px;

  &.expanded {
    background-color: lightgray;
  }
}
</style>
