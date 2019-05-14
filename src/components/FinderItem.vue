<template>
  <div class="item" :class="{ expanded: expanded }">
    <input
      v-if="selectable"
      type="checkbox"
      :checked="selected"
      @click.stop
      @change="$emit('select', $event.target.checked)"
    />
    <div class="inner-item">
      <slot />
    </div>
    <div v-if="!isLeaf" class="arrow" />
  </div>
</template>

<script>
export default {
  name: "FinderItem",
  props: {
    expanded: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    isLeaf: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  padding: 10px;
  display: flex;
  align-items: center;

  &.expanded {
    background-color: lightgray;
  }

  .inner-item {
    flex: 1;
    min-width: 0;
  }

  .arrow {
    display: inline-block;
    border-right: 3px solid black;
    border-bottom: 3px solid black;
    width: 6px;
    height: 6px;
    transform: rotate(-45deg);
  }
}
</style>
