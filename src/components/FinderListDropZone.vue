<template>
  <div
    class="drop-zone"
    :class="{
      'drag-over': dragOver,
      dragging: treeModel.isDragging(),
      'no-drop': treeModel.isDragging() && !canDrop
    }"
    :style="{
      ...(dragOver &&
        theme.primaryColor && { borderColor: theme.primaryColor }),
      ...(dragOver &&
        theme.dropZoneBgColor && { backgroundColor: theme.dropZoneBgColor })
    }"
    @dragenter.prevent="onDragEnter"
    @dragleave.prevent="onDragLeave"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <component
      :is="options.dropZoneComponent"
      v-if="options.dropZoneComponent"
      :dragging="treeModel.isDragging()"
      :drag-over="dragOver"
    />
  </div>
</template>

<script>
import { get } from "lodash-es";

export default {
  name: "FinderListDropZone",
  props: {
    treeModel: {
      type: Object,
      required: true
    },
    node: {
      type: Object,
      required: true
    },
    dragEnabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    dragCounter: 0
  }),
  computed: {
    dragOver() {
      return this.dragCounter > 0;
    },
    theme() {
      return get(this, "options.theme", {});
    },
    canDrop() {
      // Cannot drop on a descendant of itself
      if (this.treeModel.isParent(this.treeModel.draggedNodeId, this.node.id)) {
        return false;
      }
      return (
        !this.options.canDrop ||
        this.options.canDrop(this.node.id, this.treeModel.draggedNodeId)
      );
    }
  },
  methods: {
    onDragEnter() {
      if (this.canDrop && this.treeModel.isDragging()) {
        this.dragCounter++;
      }
    },
    onDragLeave() {
      if (this.canDrop && this.treeModel.isDragging()) {
        this.dragCounter--;
      }
    },
    onDrop(event) {
      event.preventDefault();
      if (!this.canDrop || !this.treeModel.isDragging()) {
        return;
      }
      this.dragCounter = 0;
      this.treeModel.dropOnNode(this.node.id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/colors";

.drop-zone {
  transition: height 0.1s ease;
  height: 0.5em;
  flex-shrink: 0;
  overflow: hidden;

  &.drag-over {
    opacity: 0.5;
    margin-bottom: 0;
    height: 2em;
    border: dashed 3px $primaryColor;
    background-color: change-color($primaryColor, $alpha: 0.2);
  }
}

.no-drop * {
  cursor: no-drop;
}
</style>
