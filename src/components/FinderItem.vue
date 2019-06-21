<template>
  <div
    class="item"
    :class="{ expanded, dragged, 'drag-over': dragOver }"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
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
    <div v-if="!isLeaf" class="arrow" />
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
    selectable: {
      type: Boolean,
      default: false
    },
    treeModel: {
      type: Object,
      required: true
    },
    dragged: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isLeaf() {
      return !this.node.children || !this.node.children.length;
    },
    expanded() {
      return this.treeModel.isNodeExpanded(this.node.id);
    },
    selected() {
      return this.treeModel.isNodeSelected(this.node.id);
    }
  },
  methods: {
    onClick() {
      this.treeModel.expandNode(this.node.id);
    },
    onSelect(event) {
      this.treeModel.selectNode(this.node.id, event.target.checked);
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
