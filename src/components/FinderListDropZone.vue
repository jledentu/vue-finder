<template>
  <div
    class="drop-zone"
    :class="{ 'drag-over': dragOver }"
    @dragenter.prevent="onDragEnter"
    @dragleave.prevent="onDragLeave"
    @dragover.prevent
    @drop.prevent="onDrop"
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
    onDrop(event) {
      if (!this.treeModel.isDragging()) {
        return;
      }
      this.dragCounter = 0;
      this.treeModel.dropOnNode(this.node.id);
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