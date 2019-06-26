<template>
  <div
    class="item"
    :class="{
      expanded,
      draggable: dragEnabled,
      dragged,
      'drag-over': dragOver
    }"
    :draggable="dragEnabled"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragstart="onDragStart"
    @dragover="onDragOver"
    @drop="onDrop"
    @dragend="onDragEnd"
    @click="onClick"
  >
    <input
      v-if="selectable"
      type="checkbox"
      :checked="selected"
      :disabled="node.selectable === false"
      @click.stop
      @change="onSelect"
    />
    <div class="inner-item">
      <slot />
    </div>
    <div v-if="!node.isLeaf" class="arrow" />
  </div>
</template>

<script>
import FinderListDropZone from "./FinderListDropZone";

export default {
  name: "FinderItem",
  mixins: [FinderListDropZone],
  props: {
    node: {
      type: Object,
      required: true
    },
    treeModel: {
      type: Object,
      required: true
    },
    selectable: {
      type: Boolean,
      default: false
    }
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
    }
  },
  methods: {
    onClick() {
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
      this.treeModel.expandNode(this.node.id);
    },
    onDragEnd() {
      if (!this.dragEnabled) {
        return;
      }
      this.treeModel.stopDrag();
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
