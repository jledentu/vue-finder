<script>
import { union, difference } from "lodash-es";
import { path, buildNodesMap } from "@/utils/tree-utils";
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
function renderTree(h, context, item, expanded) {
  if (!item.children || !item.children.length) {
    return null;
  }

  const expandedChild = item.children.find(child =>
    expanded.includes(child.id)
  );

  const itemList = (
    <FinderList
      expanded={expanded}
      items={item.children}
      selectable={context.selectable}
      on-item-expanded={context.expandItem}
      on-item-selected={context.onSelected}
    />
  );

  return (
    <div class="list-container">
      {itemList}
      {expandedChild && renderTree(h, context, expandedChild, expanded)}
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
    }
  },
  data() {
    return {
      expanded: [],
      selected: []
    };
  },
  beforeCreate() {
    Object.defineProperty(this.$options.propsData, "tree", {
      configurable: false
    });
  },
  created() {
    this.nodesMap = buildNodesMap(this.tree);
    this.selected = Object.values(this.nodesMap).filter(node => node.selected);
  },
  methods: {
    expandItem(id) {
      this.expanded = path(id, this.nodesMap);
    },
    onSelected(id, isSelected) {
      this.selected = (isSelected ? union : difference)(this.selected, [id]);
    }
  },
  render(h) {
    return (
      <div class="tree-container">
        {renderTree(h, this, this.tree, this.expanded)}
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
