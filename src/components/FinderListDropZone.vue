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
      style="flex-grow: 1"
    />
  </div>
</template>

<script lang="ts">
import { get } from "lodash-es";
import Vue, { PropType } from "vue";
import TreeModel from "@/utils/tree-model";

export default {
  name: "FinderListDropZone",
  props: {
    treeModel: {
      type: Object as PropType<TreeModel>,
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
    index: {
      type: Number,
      default: undefined
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
    dragOver(): boolean {
      return (
        this.treeModel.isDragging() && this.canDrop && this.dragCounter > 0
      );
    },
    theme(): Object {
      return get(this, "options.theme", {});
    },
    canDrop(): boolean {
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
    onDragEnter(): void {
      this.dragCounter++;
    },
    onDragLeave(): void {
      this.dragCounter--;
    },
    onDrop(event: DragEvent): void {
      event.preventDefault();
      this.dragCounter = 0;
      if (!this.canDrop || !this.treeModel.isDragging()) {
        return;
      }
      this.treeModel.dropOnNode(this.node.id, this.index);
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
