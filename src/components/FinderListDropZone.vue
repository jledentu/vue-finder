<template>
  <div
    class="drop-zone"
    :class="{
      'drag-over': dragOver,
      dragging: treeModel.isDragging(),
      'no-drop': treeModel.isDragging() && !canDrop,
    }"
    :style="{
      ...(dragOver &&
        theme.primaryColor && { borderColor: theme.primaryColor }),
      ...(dragOver &&
        theme.dropZoneBgColor && { backgroundColor: theme.dropZoneBgColor }),
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
      style="flex-grow: 1"
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
      required: true,
    },
    node: {
      type: Object,
      required: true,
    },
    dragEnabled: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: undefined,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    dragCounter: 0,
  }),
  computed: {
    dragOver() {
      return (
        this.treeModel.isDragging() && this.canDrop && this.dragCounter > 0
      );
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
    },
  },
  methods: {
    onDragEnter() {
      this.dragCounter++;
    },
    onDragLeave() {
      this.dragCounter--;
    },
    onDrop(event) {
      event.preventDefault();
      this.dragCounter = 0;
      if (!this.canDrop || !this.treeModel.isDragging()) {
        return;
      }
      this.treeModel.dropOnNode(this.node.id, this.index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../style/colors";

.drop-zone {
  transition: height 0.1s ease;
  height: 0.5em;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;

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
