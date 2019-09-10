<template>
  <div
    class="drop-zone"
    :class="{ 'drag-over': dragOver }"
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
  />
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
    }
  },
  methods: {
    onDragEnter() {
      if (this.treeModel.isDragging()) {
        this.dragCounter++;
      }
    },
    onDragLeave() {
      if (this.treeModel.isDragging()) {
        this.dragCounter--;
      }
    },
    onDrop() {
      if (!this.treeModel.isDragging()) {
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
  overflow: hidden;

  &.drag-over {
    opacity: 0.5;
    margin-bottom: 0;
    height: 2em;
    border: dashed 3px $primaryColor;
    background-color: change-color($primaryColor, $alpha: 0.2);
  }
}
</style>
