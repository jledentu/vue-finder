<template>
  <div class="item" :class="{ selected: selected }">
    <slot />
  </div>
</template>

<script>
export default {
  name: "FinderItem",
  props: {
    selected: {
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

  &.selected {
    background-color: lightgray;
  }
}
</style>
