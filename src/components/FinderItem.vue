<template>
  <div
    class="item"
    :class="{ expanded, dragged, 'drag-over': dragOver }"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
  >
    <input
      v-if="selectable"
      type="checkbox"
      :checked="selected"
      :disabled="selectionDisabled"
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
import FinderListDropZone from "./FinderListDropZone";

export default {
  name: "FinderItem",
  mixins: [FinderListDropZone],
  props: {
    expanded: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: false
    },
    selectionDisabled: {
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
    },
    dragged: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/colors";

.item {
  padding: 10px;
  display: flex;
  align-items: center;

  &.expanded {
    background-color: $primaryColor;
    color: white;

    .arrow {
      border-color: white;
    }
  }

  &.dragged {
    background-color: change-color($primaryColor, $alpha: 0.5);
  }

  &.drag-over {
    border: dashed 3px $primaryColor;
    background-color: change-color($primaryColor, $alpha: 0.2);
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
