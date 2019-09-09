<script>
import TreeModel from "@/utils/tree-model";
import FinderList from "./FinderList";

/**
 * Render the tree of an item and its selected children.
 *
 * @param {Object} h          `createElement` object
 * @param {Object} context    Context component
 * @param {Object} item       Item to render
 * @return Rendering object
 */
function renderTree(h, context, item) {
  if (!item || !item.children || item.children.length === 0) {
    return null;
  }

  const expandedChild = item.children.find(child =>
    context.treeModel.isNodeExpanded(child.id)
  );

  const options = {
    itemComponent: context.itemComponent
  };

  const itemList = (
    <FinderList
      ref="rootList"
      tree-model={context.treeModel}
      parent={item}
      items={item.children}
      selectable={context.selectable}
      drag-enabled={context.dragEnabled}
      options={options}
    />
  );

  return (
    <div class="list-container">
      {itemList}
      {expandedChild && renderTree(h, context, expandedChild)}
    </div>
  );
}

/**
 * Get a value animated by a ease out Bezier curve.
 */
function easeOutQuad(elapsedTime, start, end, duration) {
  return -end * (elapsedTime /= duration) * (elapsedTime - 2) + start;
}

export default {
  name: "Finder",
  components: {
    FinderList
  },
  props: {
    /**
     * Data of the tree.
     */
    tree: {
      type: Object,
      required: true
    },
    /**
     * Enable the selection of items.
     */
    selectable: {
      type: Boolean,
      default: false
    },
    /**
     * Enable the drag & drop of items.
     */
    dragEnabled: {
      type: Boolean,
      default: false
    },
    /**
     * Function to filter displayed items.
     */
    filter: {
      type: Function,
      default: undefined
    },
    /**
     * Custom component to render items.
     */
    itemComponent: {
      type: Function,
      default: undefined
    },
    /**
     * Duration of the scroll animation (in milliseconds).
     * When an item is expanded, the finder is scrolled to the right,
     * using an animation. This parameter defines the duration of this animation.
     *
     * Set `0` for no animation.
     */
    scrollAnimationDuration: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      treeModel: {}
    };
  },
  watch: {
    tree(newTree) {
      this.treeModel.root = newTree;
    },
    filter(newFilter) {
      this.treeModel.filter = newFilter;
    }
  },
  beforeCreate() {
    Object.defineProperty(this.$options.propsData, "tree", {
      configurable: false
    });
  },
  created() {
    this.treeModel = new TreeModel(this.tree, this.filter);

    this.treeModel.on("expand", expanded => {
      this.$nextTick(() => {
        this._scrollToRight(this.scrollAnimationDuration);
      });

      /**
       * This event is triggered when an item has been expanded.
       *
       * ```html
       * <Finder :tree="tree" @expand="onExpand"/>
       * ```
       *
       * ```js
       * onExpand({ expanded }) {
       *   console.log(
       *     `Items with ${expanded.join()} IDs are now expanded`
       *   );
       * }
       * ```
       *
       * @event expand
       * @type {object}
       * @property {Array<string>} expanded IDs of expanded items
       */
      this.$emit("expand", {
        expanded
      });
    });
    this.treeModel.on("select", selected => {
      /**
       * This event is triggered when an item has been selected.
       *
       * ```html
       * <Finder :tree="tree" @select="onSelect"/>
       * ```
       *
       * ```js
       * onSelect({ selected }) {
       *   console.log(
       *     `Items with ${selected.join()} IDs are now selected`
       *   );
       * }
       * ```
       *
       * @event select
       * @type {object}
       * @property {Array<string>} selected IDs of selected items
       */
      this.$emit("select", {
        selected
      });
    });
    this.treeModel.on("move", ({ moved, to }) => {
      /**
       * This event is triggered when an item has been moved by drag and drop.
       *
       * ```html
       * <Finder :tree="tree" @move="onMove"/>
       * ```
       *
       * ```js
       * onMove({ moved, to }) {
       *   console.log(
       *     `Item with ${moved} ID has been moved
       *     to its new parent with ${to} ID`
       *   );
       * }
       * ```
       *
       * @event move
       * @type {object}
       * @property {string} moved ID of the moved item
       * @property {string} to    ID of the parent on which the item has been moved to
       */
      this.$emit("move", {
        moved,
        to
      });
    });
  },
  methods: {
    /**
     * Set a given item expanded.
     *
     * ```html
     * <Finder :tree="tree" ref="myFinder" />
     * ```
     *
     * ```js
     * this.$refs.myFinder.expand('item111');
     * ```
     *
     * @param {string} itemId ID of the item to expand
     * @public
     * @since 1.6.0
     */
    expand(itemId) {
      this.treeModel.expandNode(itemId);
    },
    _scrollToRight(scrollDuration) {
      const { scrollLeft, scrollWidth, offsetWidth } = this.$el;

      if (scrollDuration === 0) {
        this.$el.scrollLeft = scrollWidth;
        return;
      }

      const scrollDistance = scrollWidth - offsetWidth - scrollLeft;
      if (scrollDistance <= 0) {
        return;
      }

      let oldTimestamp = performance.now();
      let duration = 0;
      const step = newTimestamp => {
        const stepDuration = newTimestamp - oldTimestamp;
        duration += stepDuration;

        if (duration >= scrollDuration) {
          this.$el.scrollLeft = this.$el.scrollWidth;
          return;
        }

        oldTimestamp = newTimestamp;

        this.$el.scrollLeft = easeOutQuad(
          duration,
          scrollLeft,
          scrollDistance,
          scrollDuration
        );
        window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    }
  },
  render(h) {
    return (
      <div class="tree-container">
        {this.treeModel && renderTree(h, this, this.treeModel.visibleTree)}
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.tree-container {
  overflow-x: auto;
  height: 100%;

  .list-container {
    display: flex;
    height: 100%;
  }
}
</style>
