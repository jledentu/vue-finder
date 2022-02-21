<template functional>
  <div
    class="arrow"
    :style="{
      expanded: props.expanded,
      ...(props.theme.arrowColor && { borderColor: props.theme.arrowColor }),
    }"
  ></div>
</template>

<script>
export default {
  name: "FinderItemArrow",
  props: {
    expanded: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: Object,
      default: () => {},
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.arrow {
  display: inline-block;
  border-right: 3px solid black;
  border-bottom: 3px solid black;
  width: 6px;
  height: 6px;
  transform: rotate(-45deg);

  &.expanded {
    border-color: white;
  }
}
</style>
