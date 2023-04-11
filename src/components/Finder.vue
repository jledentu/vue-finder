<script lang="jsx">
import { toRaw } from "vue";
import TreeModel from "@/utils/tree-model";
import FinderList from "./FinderList.vue";

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

  const expandedChild = item.children.find((child) =>
    context.treeModel.isNodeExpanded(child.id)
  );

  const options = {
    sortBy: context.sortBy,
    itemComponent: context.itemComponent,
    arrowComponent: context.arrowComponent,
    dragImageComponent: context.dragImageComponent,
    dropZoneComponent: context.dropZoneComponent,
    theme: context.theme,
    hasDragHandle: context.hasDragHandle,
    canDrop: context.canDrop,
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
      has-expanded-item={!!expandedChild}
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
    FinderList,
  },
  props: {
    /**
     * Data of the tree.
     *
     * ```js
     * const tree = {
     *   id: "test",
     *   label: "Test",
     *   children: [{
     *      id: "fruits",
     *      label: "Fruits",
     *      children: [{
     *        id: "orange",
     *        label: "Orange",
     *        selected: true
     *      }, {
     *        id: "apple",
     *        label: "Apple",
     *        selectable: false
     *      }, {
     *        id: "banana",
     *        label: "Banana"
     *      }],
     *   }]
     * };
     * ```
     */
    tree: {
      type: Object,
      required: true,
    },
    /**
     * Enable the selection of items.
     *
     * ::: tip
     * You can disable the selection on some items by setting them `selectable: false`.
     * :::
     *
     * ::: tip
     * You can set some items selected by default by setting them `selected: true`.
     * :::
     */
    selectable: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether all its descendants should be automatically selected when an item is selected.
     */
    autoSelectDescendants: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether all its descendants should be automatically deselected when an item is deselected.
     */
    autoDeselectDescendants: {
      type: Boolean,
      default: false,
    },
    /**
     * Enable the drag & drop of items.
     * Can be a `boolean`, to enable the behaviour globally, or a `function` that indicates if an item can be dragged.
     */
    dragEnabled: {
      type: [Boolean, Function],
      default: false,
    },
    /**
     * Whether a drag handle is displayed to drag items.
     */
    hasDragHandle: {
      type: Boolean,
      default: false,
    },
    /**
     * Function that indicates if a dragged item can be dropped on another.
     *
     * ```js
     * const canDrop = (target, source) => {
     *   return target.id !== 'a-readonly-item';
     * };
     * ```
     *
     * @param {string} target ID of the drop target
     * @param {string} source ID of the dragged item
     * @return Should return `true` if `source` can be dropped on `target`
     */
    canDrop: {
      type: Function,
      default: undefined,
    },
    /**
     * Function to filter displayed items.
     *
     * ```js
     * const filter = item => /^$myitem/.test(item.label);
     * ```
     */
    filter: {
      type: Function,
      default: undefined,
    },
    /**
     * Function to sort displayed items.
     *
     * ```js
     * const sortBy = (item1, item2) => item1.id > item2.id ? -1 : item1.id < item2.id ? 1 : 0;
     * ```
     */
    sortBy: {
      type: Function,
      default: undefined,
    },
    /**
     * ID of the item expanded when loaded.
     */
    defaultExpanded: {
      type: String,
      default: undefined,
    },
    /**
     * Custom component to render items.
     */
    itemComponent: {
      type: [String, Object],
      default: undefined,
    },
    /**
     * Custom component to render arrows (on items with children).
     */
    arrowComponent: {
      type: [String, Object],
      default: undefined,
    },
    /**
     * Custom component to render drag image.
     */
    dragImageComponent: {
      type: [String, Object],
      default: undefined,
    },
    /**
     * Custom component to render drop zones.
     */
    dropZoneComponent: {
      type: [String, Object],
      default: undefined,
    },
    /**
     * Styling options.
     *
     * ```js
     * const theme = {
     *   primaryColor: '#0b79d0',
     *   arrowColor: 'black',
     *   separatorColor: '#ccc',
     *   separatorWidth: '1px',
     *   dropZoneBgColor: 'rgba(33, 150, 243, 0.2)',
     *   draggedItemBgColor: 'rgba(33, 150, 243, 0.5)',
     * };
     * ```
     */
    theme: {
      type: Object,
      default: () => ({}),
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
      default: 200,
    },
  },
  emits: ["expand", "select", "move"],
  data() {
    return {
      treeModel: {},
    };
  },
  watch: {
    tree(newTree) {
      this.treeModel.root = toRaw(newTree);
    },
    filter(newFilter) {
      this.treeModel.filter = newFilter;
    },
    autoSelectDescendants(autoSelectDescendants) {
      this.treeModel.autoSelectDescendants = autoSelectDescendants;
    },
    autoDeselectDescendants(autoDeselectDescendants) {
      this.treeModel.autoDeselectDescendants = autoDeselectDescendants;
    },
  },
  created() {
    this.treeModel = new TreeModel(toRaw(this.tree), {
      filter: this.filter,
      defaultExpanded: this.defaultExpanded,
      autoSelectDescendants: this.autoSelectDescendants,
      autoDeselectDescendants: this.autoDeselectDescendants,
    });

    this.treeModel.on("expand", (expanded, sourceEvent, expandedItems) => {
      if (sourceEvent !== "dragover") {
        this.$nextTick(() => {
          this._scrollToRight(this.scrollAnimationDuration);
        });
      }

      /**
       * This event is triggered when an item has been expanded.
       *
       * ```html
       * <Finder :tree="tree" @expand="onExpand"/>
       * ```
       *
       * ```js
       * onExpand({ expanded, sourceEvent, expandedItems }) {
       *   console.log(
       *     `Items with ${expanded.join()} IDs are now expanded`
       *   );
       * }
       * ```
       *
       * @event expand
       * @type {object}
       * @property {Array<string>} expanded      IDs of expanded items
       * @property {string}        sourceEvent   Name of the event that triggered the action (`"click"`, `"focus"`, `"drop"`, `"dragover"` or `undefined`)
       * @property {Array<Object>} expandedItems List of expanded items
       */
      this.$emit("expand", {
        expanded,
        sourceEvent,
        expandedItems,
      });
    });
    this.treeModel.on("select", (selected, selectedItems) => {
      /**
       * This event is triggered when an item has been selected.
       *
       * ```html
       * <Finder :tree="tree" @select="onSelect"/>
       * ```
       *
       * ```js
       * onSelect({ selected, selectedItems }) {
       *   console.log(
       *     `Items with ${selected.join()} IDs are now selected`
       *   );
       * }
       * ```
       *
       * @event select
       * @type {object}
       * @property {Array<string>} selected      IDs of selected items
       * @property {Array<Object>} selectedItems List of selected items
       */
      this.$emit("select", {
        selected,
        selectedItems,
      });
    });
    this.treeModel.on("move", ({ moved, to, index }) => {
      /**
       * This event is triggered when an item has been moved by drag and drop.
       * When an item is dropped on a dropzone between two elements, a `index` is also provided.
       *
       * ```html
       * <Finder :tree="tree" @move="onMove"/>
       * ```
       *
       * ```js
       * onMove({ moved, to, index }) {
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
       * @property {number} index Index of the dropzone
       */
      this.$emit("move", {
        moved,
        to,
        index,
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
     * @param {string} itemId      ID of the item to expand
     * @param {string} sourceEvent Source event that will appear in `expand` event
     *                             (`api` by default)
     * @public
     * @since 1.6.0
     */
    expand(itemId, sourceEvent = "api") {
      this.treeModel.expandNode(itemId, sourceEvent);
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
      const step = (newTimestamp) => {
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
    },
  },
  render(h) {
    return (
      <div class="tree-container">
        {this.treeModel && renderTree(h, this, this.treeModel.visibleTree)}
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
.tree-container {
  overflow-x: auto;
  position: relative;
  display: flex;
  align-items: stretch;

  .list-container {
    display: flex;
    align-items: stretch;
  }
}
</style>
