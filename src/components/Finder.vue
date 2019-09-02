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
