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

  const itemList = (
    <FinderList
      tree-model={context.treeModel}
      parent={item}
      items={item.children}
      selectable={context.selectable}
      drag-enabled={context.dragEnabled}
    />
  );

  return (
    <div class="list-container">
      {itemList}
      {expandedChild && renderTree(h, context, expandedChild)}
    </div>
  );
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
    }
  },
  data() {
    return {
      treeModel: {}
    };
  },
  watch: {
    filter: {
      handler(newFilter) {
        this.treeModel.filter = newFilter;
      }
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
