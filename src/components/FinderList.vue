<script>
import FinderItem from "./FinderItem";
import FinderListDropZone from "./FinderListDropZone";

function renderItems(h, { props, listeners }) {
  const DropZoneComponent = props.dropZoneComponent;

  function onItemEvent(eventName, itemId) {
    return event => {
      listeners[eventName](itemId, event);
    };
  }

  function onDragStart(item) {
    return event => {
      event.dataTransfer.setData("id", item.id);
      listeners["item-dragged"](item.id, event);
    };
  }

  function onDragOver(item) {
    return event => {
      if (item.children && item.children.length) {
        listeners["item-expanded"](item.id, event);
      }
    };
  }

  return props.items.map(item => [
    ...[
      props.dragEnabled && <DropZoneComponent key={`drop-zone-${item.id}`} />
    ],

    <FinderItem
      key={`item-${item.id}`}
      node={item}
      treeModel={props.treeModel}
      class={{ draggable: props.dragEnabled }}
      selectable={props.selectable}
      enabled={props.dragEnabled}
      dragged={props.draggedItem.id === item.id}
      vOn:start={onDragStart(item)}
      vOn:dragover_native={onDragOver(item)}
      vOn:drop_native={onItemEvent("drop", item.id)}
      vOn:dragend_native={onItemEvent("dragend", item.id)}
    >
      {item.label}
    </FinderItem>
  ]);
}

export default {
  name: "FinderList",
  functional: true,
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemComponent: {
      type: Object,
      default: () => FinderItem
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
    draggedItem: {
      type: Object,
      default: () => ({})
    }
  },
  render(h, { props, listeners }) {
    const DropZoneComponent = props.dropZoneComponent;

    return [
      <div class="list">
        {[
          ...renderItems(h, { props, listeners }),
          ...[props.dragEnabled && <DropZoneComponent class="last" />]
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
  height: 100%;
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
