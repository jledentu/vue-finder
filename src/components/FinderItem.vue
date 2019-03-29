<template>
  <div class="item" :class="{ expanded: expanded }">
    <input
      v-if="selectable"
      type="checkbox"
      :checked="selected"
      @click.stop
      @change="$emit('select', $event.target.checked)"
    />
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
    },
    selectable: {
      type: Boolean,
      default: false
    },
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
  display: flex;
  align-items: center;

  &.expanded {
    background-color: lightgray;
  }
}
</style>
