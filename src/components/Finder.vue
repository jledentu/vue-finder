<script>
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
      on-item-selected={context.expandItem}
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
    }
  },
  data() {
    return {
      expanded: []
    };
  },
  beforeCreate() {
    Object.defineProperty(this.$options.propsData, "tree", {
      configurable: false
    });
  },
  created() {
    this.nodesMap = buildNodesMap(this.tree);
  },
  methods: {
    expandItem(id) {
      this.expanded = path(id, this.nodesMap);
    }
  },
  render(h) {
    return renderTree(h, this, this.tree, this.expanded);
  }
};
</script>

<style lang="scss" scoped>
.list-container {
  display: flex;
}
</style>
