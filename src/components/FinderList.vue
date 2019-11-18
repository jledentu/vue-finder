<script>
import { get } from "lodash-es";
import FinderItem from "./FinderItem";
import FinderListDropZone from "./FinderListDropZone";

function renderItems(h, { props, expandedItemIndex }) {
  const DropZoneComponent = props.dropZoneComponent;

  let { items, options } = props;

  if (options.sortBy) {
    items = [...items].sort(options.sortBy);
  }

  return items.map((item, index) => [
    ...[
      props.dragEnabled && (
        <DropZoneComponent
          key={`drop-zone-${item.id}`}
          node={props.parent}
          treeModel={props.treeModel}
          dragEnabled={props.dragEnabled}
          options={props.options}
        />
      )
    ],

    <FinderItem
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
  ]);
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
  functional: true,
  props: {
    parent: {
      type: Object,
      default: () => ({})
    },
    items: {
      type: Array,
      default: () => []
    },
    dropZoneComponent: {
      type: Object,
      default: () => FinderListDropZone
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
      type: Boolean,
      default: Boolean
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
  render(h, { props, listeners }) {
    const DropZoneComponent = props.dropZoneComponent;
    const separatorColor = get(props, "options.theme.separatorColor", "");
    const separatorWidth = get(props, "options.theme.separatorWidth", "");
    const style = {
      ...(separatorColor && { borderColor: separatorColor }),
      ...(separatorWidth && { borderWidth: separatorWidth })
    };

    const expandedItemIndex = Math.max(
      0,
      props.items.findIndex(item => props.treeModel.isNodeExpanded(item.id))
    );

    function navigate(event) {
      let sibling;
      if (event.key === "ArrowDown") {
        sibling = getNextItemElement(event.target);
      } else if (event.key === "ArrowUp") {
        sibling = getPreviousItemElement(event.target);
      }

      if (sibling) {
        sibling.focus();
      }
    }

    return [
      <div class="list" style={style} vOn:keydown={navigate}>
        {[
          ...renderItems(h, { props, listeners, expandedItemIndex }),
          ...[
            props.dragEnabled && (
              <DropZoneComponent
                class="last"
                treeModel={props.treeModel}
                node={props.parent}
                dragEnabled={props.dragEnabled}
                options={props.options}
              />
            )
          ]
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

  .draggable {
    cursor: move;
    cursor: grab;
  }
}

.last {
  flex-grow: 1;
}
</style>
