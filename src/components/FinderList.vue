<template>
  <div v-if="parent && items?.length > 0" class="list-container">
    <div class="list" :style="style" @keydown="navigate">
      <template v-for="(item, index) in sortedItems" :key="`item-${item.id}`">
        <FinderListDropZone
          v-if="dragEnabled"
          :node="parent"
          :tree-model="treeModel"
          :drag-enabled="dragEnabled"
          :index="index"
          :options="options"
        >
          <template #default="dropZoneProps">
            <slot name="drop-zone" v-bind="dropZoneProps" />
          </template>
        </FinderListDropZone>
        <FinderItem
          :node="item"
          :tree-model="treeModel"
          :selectable="selectable"
          :drag-enabled="dragEnabled"
          :options="options"
          :tabindex="index === expandedItemIndex ? '0' : '-1'"
        >
          {{ item.label }}
          <template #item="itemProps">
            <slot name="item" v-bind="itemProps" />
          </template>
          <template #arrow="arrowProps">
            <slot name="arrow" v-bind="arrowProps" />
          </template>
          <template #drag-image="dragImageProps">
            <slot name="drag-image" v-bind="dragImageProps" />
          </template>
        </FinderItem>
      </template>
      <FinderListDropZone
        v-if="dragEnabled"
        class="last"
        :tree-model="treeModel"
        :node="parent"
        :drag-enabled="dragEnabled"
        :index="items.length"
        :options="options"
      >
        <template #default="dropZoneProps">
          <slot name="drop-zone" v-bind="dropZoneProps" />
        </template>
      </FinderListDropZone>
    </div>

    <FinderList
      v-if="!!expandedChild"
      :parent="expandedChild"
      :tree-model="treeModel"
      :selectable="selectable"
      :drag-enabled="dragEnabled"
      :options="options"
    >
      <template #item="itemProps">
        <slot name="item" v-bind="itemProps" />
      </template>
      <template #arrow="arrowProps">
        <slot name="arrow" v-bind="arrowProps" />
      </template>
      <template #drop-zone>
        <slot name="drop-zone" />
      </template>
      <template #drag-image="dragImageProps">
        <slot name="drag-image" v-bind="dragImageProps" />
      </template>
    </FinderList>
  </div>
</template>
<script>
import { get } from "lodash-es";
import FinderItem from "./FinderItem.vue";
import FinderListDropZone from "./FinderListDropZone.vue";

function getPreviousItemElement(element) {
  let sibling = element.previousSibling;

  while (sibling) {
    if (sibling.classList && sibling.classList.contains("item")) {
      return sibling;
    }
    sibling = sibling.previousSibling;
  }
}

function getNextItemElement(element) {
  let sibling = element.nextSibling;

  while (sibling) {
    if (sibling.classList && sibling.classList.contains("item")) {
      return sibling;
    }
    sibling = sibling.nextSibling;
  }
}

export default {
  name: "FinderList",
  components: {
    FinderItem,
    FinderListDropZone,
  },
  props: {
    parent: {
      type: Object,
      default: () => ({}),
    },
    treeModel: {
      type: Object,
      required: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    dragEnabled: {
      type: [Boolean, Function],
      default: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    items() {
      return this.parent?.children;
    },
    expandedChild() {
      return this.items?.find((child) =>
        this.treeModel.isNodeExpanded(child.id),
      );
    },
    sortedItems() {
      return this.options.sortBy
        ? [...this.items].sort(this.options.sortBy)
        : this.items;
    },
    style() {
      const separatorColor = get(this.options, "theme.separatorColor", "");
      const separatorWidth = get(this.options, "theme.separatorWidth", "");
      return {
        ...(separatorColor && { borderColor: separatorColor }),
        ...(separatorWidth && { borderWidth: separatorWidth }),
      };
    },
    expandedItemIndex() {
      return Math.max(
        0,
        this.items.findIndex((item) => this.treeModel.isNodeExpanded(item.id)),
      );
    },
  },
  methods: {
    navigate(event) {
      let sibling;
      if (event.key === "ArrowDown") {
        sibling = getNextItemElement(event.target);
      } else if (event.key === "ArrowUp") {
        sibling = getPreviousItemElement(event.target);
      }

      if (sibling) {
        sibling.focus();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list-container {
  display: flex;
  align-items: stretch;
}

.list {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  min-height: 100%;
  border-right: solid 1px #ccc;
  overflow: auto;
  flex-shrink: 0;

  [draggable="true"] {
    cursor: move;
    cursor: grab;
  }
}

.last {
  flex-grow: 1;
}
</style>
