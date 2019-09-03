<script>
import FinderItem from "./FinderItem";
import FinderListDropZone from "./FinderListDropZone";

function renderItems(h, { props }) {
  const DropZoneComponent = props.dropZoneComponent;
  return props.items.map(item => [
    ...[
      props.dragEnabled && (
        <DropZoneComponent
          key={`drop-zone-${item.id}`}
          node={props.parent}
          treeModel={props.treeModel}
          dragEnabled={props.dragEnabled}
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
    >
      {item.label}
    </FinderItem>
  ]);
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
    }
  },
  render(h, { props, listeners }) {
    const DropZoneComponent = props.dropZoneComponent;

    return [
      <div class="list">
        {[
          ...renderItems(h, { props, listeners }),
          ...[
            props.dragEnabled && (
              <DropZoneComponent
                class="last"
                treeModel={props.treeModel}
                node={props.parent}
                dragEnabled={props.dragEnabled}
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
