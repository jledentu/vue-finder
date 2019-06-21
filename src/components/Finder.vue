<script>
import TreeModel from "@/utils/tree-model";
import FinderList from "./FinderList";

/**
 * Render the tree of an item and its selected children.
 *
 * @param {Object} h          `createElement` object
 * @param {Object} context    Context component
 * @param {Object} item       Item to render
 * @param {String} selectedId ID of the selected item in the tree
 * @return Rendering object
 */
function renderTree(h, context, item, model) {
  if (!item.children || !item.children.length) {
    return null;
  }

  const expandedChild = item.children.find(child =>
    model.isNodeExpanded(child.id)
  );

  const itemList = (
    <FinderList
      tree-model={model}
      items={item.children}
      selectable={context.selectable}
      drag-enabled={context.dragEnabled}
      dragged-item={context.draggedItem}
      on-item-dragged={context.onDragged}
      on-drop={context.onDrop}
      on-dragend={context.onDragEnd}
    />
  );

  return (
    <div class="list-container">
      {itemList}
      {expandedChild && renderTree(h, context, expandedChild, model)}
    </div>
  );
}

export default {
  name: "Finder",
  components: {
    FinderList
  },
  props: {
    tree: {
      type: Object,
      default: () => ({})
    },
    selectable: {
      type: Boolean,
      default: false
    },
    dragEnabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeModel: {}
    };
  },
  beforeCreate() {
    Object.defineProperty(this.$options.propsData, "tree", {
      configurable: false
    });
  },
  created() {
    this.treeModel = new TreeModel(this.tree);
  },
  methods: {
    onDragged(id) {
      this.treeModel.startDrag(id);
    },
    onDrop() {},
    onDragEnd() {
      this.treeModel.stopDrag();
    }
  },
  render(h) {
    return (
      <div class="tree-container">
        {this.treeModel && renderTree(h, this, this.tree, this.treeModel)}
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
