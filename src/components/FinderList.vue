<script>
import { get } from "lodash-es";
import FinderItem from "./FinderItem";
import FinderListDropZone from "./FinderListDropZone";

function renderItem(h, { props, item, index, expandedItemIndex }) {
  return [
    ...[
      props.dragEnabled && (
        <FinderListDropZone
          key={`drop-zone-${item.id}`}
          node={props.parent}
          treeModel={props.treeModel}
          dragEnabled={props.dragEnabled}
          index={index}
          options={props.options}
        />
      )
    ],

    <FinderItem
      ref={`item-${item.id}`}
      key={`item-${item.id}`}
      node={item}
      treeModel={props.treeModel}
      selectable={props.selectable}
      dragEnabled={props.dragEnabled}
      options={props.options}
      tabindex={index === expandedItemIndex ? "0" : "-1"}
    >
      {item.label}
    </FinderItem>
  ];
}

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
    FinderListDropZone
  },
  inject: ["virtualize", "itemHeight"],
  props: {
    parent: {
      type: Object,
      default: () => ({})
    },
    items: {
      type: Array,
      default: () => []
    },
    treeModel: {
      type: Object,
      required: true
    },
    selectable: {
      type: Boolean,
      default: false
    },
    dragEnabled: {
      type: [Boolean, Function],
      default: false
    },
    options: {
      type: Object,
      default: () => ({})
    },
    hasExpandedItem: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listWidth: null,
      visibleStart: null,
      visibleEnd: null
    };
  },
  computed: {
    sortedItems() {
      return this.options.sortBy
        ? [...this.items].sort(this.options.sortBy)
        : this.items;
    },
    topOffset() {
      return this.visibleStart * this.itemHeight;
    },
    bottomOffset() {
      return (this.items.length - this.visibleEnd) * this.itemHeight;
    },
    style() {
      const separatorColor = get(this.options, "theme.separatorColor", "");
      const separatorWidth = get(this.options, "theme.separatorWidth", "");
      return {
        ...(separatorColor && { borderColor: separatorColor }),
        ...(separatorWidth && { borderWidth: separatorWidth }),
        ...(this.listWidth && { width: `${this.listWidth}px` })
      };
    },
    expandedItemIndex() {
      return Math.max(
        0,
        this.sortedItems.findIndex(item =>
          this.treeModel.isNodeExpanded(item.id)
        )
      );
    }
  },
  watch: {
    parent: {
      immediate: true,
      handler(newParent, oldParent) {
        if (newParent.id !== oldParent?.id && this.$el) {
          this.listWidth = null;
          this.$el.scrollTop = 0;
          this.updateVisibleRange();
        }
      }
    },
    "items.length": {
      handler() {
        this.updateVisibleRange();
      }
    }
  },
  mounted() {
    this.updateVisibleRange();

    const resizeObserver = new ResizeObserver(() => {
      this.updateVisibleRange();
    });

    resizeObserver.observe(this.$el);

    this.$el.addEventListener("keydown", this.navigate);
  },
  destroyed() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
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
    onScroll() {
      if (!this.virtualize || this.isUpdatingVisibleRange) {
        return;
      }

      window.requestAnimationFrame(() => {
        this.updateVisibleRange();
        this.isUpdatingVisibleRange = false;
      });

      this.isUpdatingVisibleRange = true;
    },
    getOffset() {
      Math.floor(this.$el.scrollTop / this.itemHeight) + 1;
    },
    getFocusedElement() {
      const focusedItem = this.$refs[`item-${this.treeModel.focusedNodeId}`];
      return focusedItem ? focusedItem.$el : null;
    },
    getVirtualRange() {
      const overscan = 5;
      const start = Math.max(
        0,
        Math.floor(this.$el.scrollTop / this.itemHeight) + 1 - overscan
      );
      const capacity = Math.ceil(this.$el.clientHeight / this.itemHeight);
      const end = Math.min(start + capacity + overscan, this.items.length);

      return { start, end };
    },
    async updateVisibleRange() {
      if (!this.virtualize) {
        return;
      }

      const { start, end } = this.getVirtualRange();

      if (start === this.visibleStart && end === this.visibleEnd) {
        return;
      }

      const mustRestoreFocus =
        this.getFocusedElement() === document.activeElement;

      this.visibleStart = start;
      this.visibleEnd = end;

      // Wait for re-rendering
      await this.$nextTick();

      // Set initial list width to avoid horizontal jumping when scrolling
      if (!this.listWidth) {
        this.listWidth = this.$el.clientWidth;
      }

      if (mustRestoreFocus) {
        // We could have lost focus on focused item while updating the visible range
        // so we need to refocus it
        const focusedItem = this.getFocusedElement();

        if (focusedItem && focusedItem !== document.activeElement) {
          focusedItem.focus({
            preventScroll: true
          });
        }
      }
    }
  },
  render(h) {
    const expandedItemIndex = Math.max(
      0,
      this.sortedItems.findIndex(item => this.treeModel.isNodeExpanded(item.id))
    );

    const isVisible = index =>
      !this.virtualize ||
      (index >= this.visibleStart && index <= this.visibleEnd);

    return [
      <div class="list" style={this.style} vOn:scroll={this.onScroll}>
        {[
          ...(this.virtualize
            ? [<div style={{ flexShrink: 0, height: `${this.topOffset}px` }} />]
            : []),
          ...this.sortedItems.map(
            (item, index) =>
              isVisible(index) &&
              renderItem(h, {
                props: this.$props,
                item,
                index,
                expandedItemIndex
              })
          ),
          ...[
            this.dragEnabled && (
              <FinderListDropZone
                class="last"
                treeModel={this.treeModel}
                node={this.parent}
                dragEnabled={this.dragEnabled}
                index={this.items.length}
                options={this.options}
              />
            )
          ],
          ...(this.virtualize
            ? [
                <div
                  style={{ flexShrink: 0, height: `${this.bottomOffset}px` }}
                />
              ]
            : [])
        ]}
      </div>
    ];
  }
};
</script>

<style lang="scss" scoped>
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
