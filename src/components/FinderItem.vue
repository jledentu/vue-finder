<template>
  <div
    class="item"
    role="button"
    :class="{
      expanded,
      draggable: dragEnabled && draggable,
      dragged,
      'has-drag-handle': dragEnabled && options.hasDragHandle,
      'drag-over': dragOver,
      'no-drop': treeModel.isDragging() && !canDrop
    }"
    :style="{
      ...(expanded &&
        theme.primaryColor && { backgroundColor: theme.primaryColor }),
      ...(dragged &&
        theme.draggedItemBgColor && {
          backgroundColor: theme.draggedItemBgColor
        }),
      ...(dragged &&
        theme.draggedItemBoxShadow && {
          'box-shadow': theme.draggedItemBoxShadow
        }),
      ...(dragOver &&
        theme.primaryColor && { borderColor: theme.primaryColor }),
      ...(dragOver &&
        theme.dropZoneBgColor && { backgroundColor: theme.dropZoneBgColor })
    }"
    :draggable="dragEnabled && draggable"
    :aria-expanded="node.isLeaf ? undefined : expanded"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragstart="onDragStart"
    @dragover="onDragOver"
    @drop="onDrop"
    @dragend="onDragEnd"
    @focus="onFocus"
  >
    <div
      v-if="dragEnabled && options.hasDragHandle"
      class="drag-handle"
      @mousedown="draggable = true"
      @mouseup="draggable = false"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path
          d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2m0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8m0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14m6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6m0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8m0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14"
        />
      </svg>
    </div>
    <input
      v-if="selectable"
      type="checkbox"
      :checked="selected"
      :disabled="node.selectable === false"
      :aria-label="node.label"
      @click.stop
      @change="onSelect"
    />
    <component :is="itemComponent" class="inner-item" :item="node">
      <slot />
    </component>
    <div
      v-if="!node.isLeaf"
      class="arrow"
      :style="{
        ...(theme.arrowColor && { borderColor: theme.arrowColor })
      }"
    />
  </div>
</template>

<script>
import { debounce } from "lodash-es";
import FinderListDropZone from "./FinderListDropZone";

export default {
  name: "FinderItem",
  mixins: [FinderListDropZone],
  props: {
    selectable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      draggable: false
    };
  },
  computed: {
    expanded() {
      return this.treeModel.isNodeExpanded(this.node.id);
    },
    selected() {
      return this.treeModel.isNodeSelected(this.node.id);
    },
    dragged() {
      return this.treeModel.isNodeDragged(this.node.id);
    },
    itemComponent() {
      return this.options.itemComponent || "div";
    }
  },
  watch: {
    "options.hasDragHandle": {
      immediate: true,
      handler(newValue) {
        this.draggable = !newValue;
      }
    }
  },
  methods: {
    onFocus() {
      this.treeModel.expandNode(this.node.id);
    },
    onSelect(event) {
      this.treeModel.selectNode(this.node.id, event.target.checked);
    },
    onDragStart(event) {
      if (!this.dragEnabled) {
        return;
      }

      event.dataTransfer.setData("text/plain", this.node.id);
      this.treeModel.startDrag(this.node.id);
    },
    onDragOver(event) {
      event.preventDefault();

      if (!this.dragEnabled) {
        return;
      }

      if (this.canDrop) {
        event.dataTransfer.dropEffect = "all";
      } else {
        event.dataTransfer.dropEffect = "none";
      }

      if (this.canDrop || !this.node.isLeaf) {
        this.expand();
      }
    },
    onDragEnd() {
      if (!this.dragEnabled) {
        return;
      }

      if (this.options.hasDragHandle) {
        this.draggable = false;
      }

      this.treeModel.stopDrag();
    },
    expand: debounce(
      function() {
        this.treeModel.expandNode(this.node.id);
      },
      100,
      {
        leading: true
      }
    )
  }
};
</script>

<style lang="scss" scoped>
@import "../style/colors";

.item {
  padding-right: 10px;
  display: flex;
  align-items: center;
  position: relative;

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

  &.has-drag-handle .inner-item {
    padding-left: 0;
  }

  &.no-drop {
    color: gray;
  }

  .inner-item {
    flex: 1;
    min-width: 0;
    padding: 10px;
  }

  .arrow {
    display: inline-block;
    border-right: 3px solid black;
    border-bottom: 3px solid black;
    width: 6px;
    height: 6px;
    transform: rotate(-45deg);
  }

  &:focus {
    outline: none;
  }

  .drag-handle {
    fill: #bbb;
    padding: 10px 2px 10px 1px;
    width: 15px;
    height: 15px;
    cursor: move;
    cursor: grab;
  }
}
</style>
