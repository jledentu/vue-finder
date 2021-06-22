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
        'no-drop': treeModel.isDragging() && !canDrop
      }
    ]"
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
    :draggable="dragEnabled && !options.hasDragHandle"
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
      @mousedown="$el.setAttribute('draggable', 'true')"
      @mouseup="$el.setAttribute('draggable', 'false')"
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
</template>

<script>
import Vue from "vue";
import { css } from "@/utils/dom-utils";
import FinderItemArrow from "./FinderItemArrow";
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
    }
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
    }
  },
  methods: {
    onMouseDown() {
      this.mousedown = true;

      setTimeout(() => {
        this.mousedown = false;
      }, 100);
    },
    onClick() {
      if (this.node.isLeaf) {
        this.treeModel.selectNode(this.node.id, event.target.checked);
      } else {
        this.treeModel.expandNode(this.node.id, "click");
      }
    },
    onFocus() {
      if (!this.mousedown) {
        this.treeModel.expandNode(this.node.id, "focus");
      }
    },
    onSelect(event) {
      this.treeModel.selectNode(this.node.id, event.target.checked);
    },
    onDragStart(event) {
      if (!this.dragEnabled) {
        return;
      }

      if (this.options.dragImageComponent) {
        this.appendGhost();
        event.dataTransfer.setDragImage(this.ghost, 0, 0);
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
      if (this.ghost) {
        this.ghost.parentNode.removeChild(this.ghost);
        this.ghost = null;
      }
      if (!this.dragEnabled) {
        return;
      }

      if (this.options.hasDragHandle) {
        this.$el.setAttribute("draggable", "false");
      }

      this.treeModel.stopDrag();
    },
    appendGhost() {
      this.ghost = document.createElement("div");
      const ghostContent = document.createElement("div");
      const vm = new Vue({
        render: createElement => {
          return createElement(this.options.dragImageComponent, {
            props: {
              item: this.node
            }
          });
        }
      }).$mount(ghostContent);

      this.ghost.appendChild(vm.$el);
      css(vm.$el, {
        boxShadow: "0 3px 4px rgba(116, 116, 116, 0.3)"
      });
      css(this.ghost, {
        position: "absolute",
        padding: "10px",
        top: "-1000px",
        boxSizing: "border-box",
        pointerEvents: "none"
      });
      this.$el.ownerDocument.body.appendChild(this.ghost);
    }
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
