<template>
  <div
    class="drop-zone"
    :class="{ 'drag-over': dragOver }"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragover="onDragOver"
    @drop="onDrop"
  />
</template>

<script>
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
    }
  },
  data: () => ({
    dragCounter: 0
  }),
  computed: {
    dragOver() {
      return this.dragCounter > 0;
    }
  },
  methods: {
    onDragEnter(event) {
      event.preventDefault();
      if (this.treeModel.isDragging()) {
        this.dragCounter++;
      }
    },
    onDragLeave(event) {
      event.preventDefault();
      if (this.treeModel.isDragging()) {
        this.dragCounter--;
      }
    },
    onDragOver(event) {
      event.preventDefault();
    },
    onDrop(event) {
      if (!this.dragEnabled || !this.treeModel.isDragging()) {
        return;
      }
      this.dragCounter = 0;
      this.treeModel.dropOnNode(this.node.id);
      event.preventDefault();
      event.dataTransfer.clearData();
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
