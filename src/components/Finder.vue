<script>
import { contains } from "@/utils/tree-utils";
import FinderList from "./FinderList.vue";

/**
 * Render the tree of an item and its selected children.
 *
 * @param {Object} h          `createElement` object
 * @param {Object} context    Context component
 * @param {Object} item       Item to render
 * @param {String} selectedId ID of the selected item in the tree
 * @return Rendering object
 */
function renderTree(h, context, item, selectedId) {
  const selectedChild = item.children
    ? item.children.find(child => contains(child, selectedId))
    : null;

  const itemList = (
    <FinderList
      selected-id={selectedChild ? selectedChild.id : ""}
      items={item.children}
      on-item-selected={context.selectItem}
    />
  );

  return (
    <div class="list-container">
      {itemList}
      {selectedChild && renderTree(h, context, selectedChild, selectedId)}
    </div>
  );
}

export default {
  name: "Finder",
  components: {
    FinderList
  },
  data() {
    return {
      selected: ""
    };
  },
  props: {
    tree: {
      type: Object,
      default: () => ({})
    }
  },
  render(h) {
    return renderTree(h, this, this.tree, this.selected);
  },
  methods: {
    selectItem(id) {
      this.selected = id;
    }
  }
};
</script>

<style lang="less" scoped>
.list-container {
  display: flex;
}
</style>
