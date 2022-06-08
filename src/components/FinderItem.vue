<template>
  <div
    class="item"
    role="button"
    :class="[
      node.cssClass || '',
      {
        expanded,
        draggable: dragEnabled && !options.hasDragHandle,
        dragged,
        'has-drag-handle': dragEnabled && options.hasDragHandle,
        'drag-over': dragOver,
        'no-drop': treeModel.isDragging() && !canDrop,
      },
    ]"
    :style="{
      ...(expanded &&
        theme.primaryColor && { backgroundColor: theme.primaryColor }),
      ...(dragged &&
        theme.draggedItemBgColor && {
          backgroundColor: theme.draggedItemBgColor,
        }),
      ...(dragged &&
        theme.draggedItemBoxShadow && {
          'box-shadow': theme.draggedItemBoxShadow,
        }),
      ...(dragOver &&
        theme.primaryColor && { borderColor: theme.primaryColor }),
      ...(dragOver &&
        theme.dropZoneBgColor && { backgroundColor: theme.dropZoneBgColor }),
    }"
    :draggable="dragEnabled"
    :aria-expanded="node.isLeaf ? undefined : expanded"
    @mousedown="onMouseDown"
    @click="onClick"
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
      @mousedown="dragHandleOver = true"
      @mouseup="dragHandleOver = false"
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
    <component
      :is="itemComponent"
      class="inner-item"
      :item="node"
      :expanded="expanded"
      :dragged="dragged"
    >
      <slot />
    </component>
    <component
      :is="arrowComponent"
      v-if="!node.isLeaf"
      :theme="theme"
      :expanded="expanded"
      :item="node"
    />
  </div>

  <Teleport to="body">
    <component
      :is="options.dragImageComponent"
      v-if="options.dragImageComponent"
      v-show="showGhost"
      ref="ghost"
      :item="node"
      style="
        box-shadow: 0 3px 4px rgba(116, 116, 116, 0.3);
        position: absolute;
        padding: 10px;
        top: -1000px;
        box-sizing: border-box;
        pointer-events: none;
      "
    />
  </Teleport>
</template>

<script>
import FinderItemArrow from "./FinderItemArrow.vue";
import FinderListDropZone from "./FinderListDropZone.vue";

export default {
  name: "FinderItem",
  mixins: [FinderListDropZone],
  props: {
    selectable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showGhost: false,
      dragHandleOver: false,
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
    },
    arrowComponent() {
      return this.options.arrowComponent || FinderItemArrow;
    },
  },
  watch: {
    dragOver(newValue) {
      if (newValue && this.canDrop && !this.node.isLeaf) {
        this.dragOverTimeout = setTimeout(
          () => this.treeModel.expandNode(this.node.id, "dragover"),
          500
        );
      } else {
        if (this.dragOverTimeout) {
          clearTimeout(this.dragOverTimeout);
        }
      }
    },
    node() {
      if (this.dragOverTimeout) {
        clearTimeout(this.dragOverTimeout);
      }
    },
  },
  methods: {
    onMouseDown() {
      this.mousedown = true;

      setTimeout(() => {
        this.mousedown = false;
      }, 100);
    },
    onClick() {
      this.treeModel.expandNode(this.node.id, "click");
    },
    onFocus() {
      if (!this.mousedown) {
        this.treeModel.expandNode(this.node.id, "focus");
      }
    },
    onSelect(event) {
      this.treeModel.selectNode(this.node.id, event.target.checked);
    },
    async onDragStart(event) {
      if (!this.dragEnabled) {
        return;
      }

      if (this.options.hasDragHandle && !this.dragHandleOver) {
        return;
      }

      if (this.options.dragImageComponent) {
        this.showGhost = true;
        await this.$nextTick();
        console.log(this.$refs.ghost);
        event.dataTransfer.setDragImage(this.$refs.ghost.$el, 0, 0);
      }

      event.dataTransfer.setData("text/plain", this.node.id);
      this.treeModel.startDrag(this.node.id);
    },
    onDragOver(event) {
      if (!this.dragEnabled) {
        return;
      }

      event.preventDefault();

      if (this.canDrop) {
        event.dataTransfer.dropEffect = "move";
      } else {
        event.dataTransfer.dropEffect = "none";
      }
    },
    onDragEnd() {
      this.showGhost = false;
      if (!this.dragEnabled) {
        return;
      }

      this.treeModel.stopDrag();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../style/colors";

.item {
  padding-right: 10px;
  display: flex;
  align-items: center;
  position: relative;
  border: dashed 3px transparent;

  &.expanded {
    background-color: $primaryColor;
    color: white;
  }

  &.dragged {
    background-color: change-color($primaryColor, $alpha: 0.5);
  }

  &.drag-over {
    border-color: $primaryColor;
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

  &:focus {
    outline: none;
  }

  .drag-handle {
    fill: #bbb;
    padding: 10px 1px 10px 0;
    width: 15px;
    height: 15px;
    cursor: move;
    cursor: grab;
  }
}
</style>
