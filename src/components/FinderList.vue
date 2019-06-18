<template functional>
  <div class="list">
    <template v-for="item in props.items">
      <component
        :is="props.dropZoneComponent"
        v-if="props.dragEnabled"
        :key="`drop-zone-${item.id}`"
      />
      <component
        :is="props.itemComponent"
        :key="`item-${item.id}`"
        :class="{ draggable: props.dragEnabled }"
        :expanded="props.expanded.includes(item.id)"
        :selectable="props.selectable"
        :selection-disabled="item.selectable === false"
        :selected="item.selected"
        :is-leaf="!item.children || !item.children.length"
        :draggable="props.dragEnabled"
        :dragged="props.draggedItem.id === item.id"
        @click.native="listeners['item-expanded'](item.id)"
        @dragstart.native="listeners['item-dragged'](item.id, $event)"
        @dragover.native="
          item.children &&
            item.children.length &&
            listeners['item-expanded'](item.id)
        "
        @drop.native="listeners['drop'](item.id)"
        @dragend.native="listeners['dragend']"
        @select="listeners['item-selected'](item.id, $event)"
      >
        {{ item.label }}
      </component>
    </template>
    <component
      :is="props.dropZoneComponent"
      v-if="props.dragEnabled"
      class="last"
    />
  </div>
</template>

<script>
import FinderItem from "./FinderItem";
import FinderListDropZone from "./FinderListDropZone";

export default {
  name: "FinderList",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemComponent: {
      type: Object,
      default: () => FinderItem
    },
    dropZoneComponent: {
      type: Object,
      default: () => FinderListDropZone
    },
    expanded: {
      type: Array,
      default: () => []
    },
    selectable: {
      type: Boolean,
      default: false
    },
    dragEnabled: {
      type: Boolean,
      default: Boolean
    },
    draggedItem: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  height: 100%;
  border-right: solid 1px #ccc;
  overflow: auto;
  flex-shrink: 0;

  .draggable {
    cursor: move;
    cursor: grab;
  }
}

.last {
  flex-grow: 1;
}
</style>
