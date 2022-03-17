# API

## Props

### tree

- **Type:** `object`

Data of the tree.

```js
const tree = {
  id: "test",
  label: "Test",
  children: [
    {
      id: "fruits",
      label: "Fruits",
      children: [
        {
          id: "orange",
          label: "Orange",
          selected: true
        },
        {
          id: "apple",
          label: "Apple",
          selectable: false
        },
        {
          id: "banana",
          label: "Banana"
        }
      ]
    }
  ]
};
```

### selectable

- **Type:** `boolean`

* **Default:** `false`

Enable the selection of items.

::: tip
You can disable the selection on some items by setting them `selectable: false`.
:::

::: tip
You can set some items selected by default by setting them `selected: true`.
:::

### autoSelectDescendants

- **Type:** `boolean`

* **Default:** `false`

Whether all its descendants should be automatically selected when an item is selected.

### autoDeselectDescendants

- **Type:** `boolean`

* **Default:** `false`

Whether all its descendants should be automatically deselected when an item is deselected.

### dragEnabled

- **Type:** `boolean`

* **Default:** `false`

Enable the drag & drop of items.

### hasDragHandle

- **Type:** `boolean`

* **Default:** `false`

Whether a drag handle is displayed to drag items.

### canDrop

- **Type:** `func`

* **Default:** `undefined`

Function that indicates if a dragged item can be dropped on another.

```js
const canDrop = (target, source) => {
  return target.id !== "a-readonly-item";
};
```

### filter

- **Type:** `func`

* **Default:** `undefined`

Function to filter displayed items.

```js
const filter = item => /^$myitem/.test(item.label);
```

### sortBy

- **Type:** `func`

* **Default:** `undefined`

Function to sort displayed items.

```js
const sortBy = (item1, item2) =>
  item1.id > item2.id ? -1 : item1.id < item2.id ? 1 : 0;
```

### defaultExpanded

- **Type:** `string`

* **Default:** `undefined`

ID of the item expanded when loaded.

### itemComponent

- **Type:** `string|object`

* **Default:** `undefined`

Custom component to render items.

### arrowComponent

- **Type:** `string|object`

* **Default:** `undefined`

Custom component to render arrows (on items with children).

### dragImageComponent

- **Type:** `string|object`

* **Default:** `undefined`

Custom component to render drag image.

### dropZoneComponent

- **Type:** `string|object`

* **Default:** `undefined`

Custom component to render drop zones.

### theme

- **Type:** `object`

* **Default:** `{}`

Styling options.

```js
const theme = {
  primaryColor: "#0b79d0",
  arrowColor: "black",
  separatorColor: "#ccc",
  separatorWidth: "1px",
  dropZoneBgColor: "rgba(33, 150, 243, 0.2)",
  draggedItemBgColor: "rgba(33, 150, 243, 0.5)"
};
```

### scrollAnimationDuration

- **Type:** `number`

* **Default:** `200`

Duration of the scroll animation (in milliseconds).
When an item is expanded, the finder is scrolled to the right,
using an animation. This parameter defines the duration of this animation.

Set `0` for no animation.

## Methods

### expand <Badge text="1.6.0"/>

Set a given item expanded.

```html
<Finder :tree="tree" ref="myFinder" />
```

```js
this.$refs.myFinder.expand("item111");
```

#### Parameters

| Name               | Type     | Description                                     |
| ------------------ | -------- | ----------------------------------------------- |
| `itemId`           | `string` | ID of the item to expand                        |
| `sourceEvent`      | `string` | Source event that will appear in `expand` event |
| (`api` by default) |

## Events

### expand

This event is triggered when an item has been expanded.

```html
<Finder :tree="tree" @expand="onExpand" />
```

```js
onExpand({ expanded, sourceEvent }) {
  console.log(
    `Items with ${expanded.join()} IDs are now expanded`
  );
}
```

#### Properties

| Name                                                          | Type            | Description                                 |
| ------------------------------------------------------------- | --------------- | ------------------------------------------- |
| `expanded`                                                    | `Array<string>` | IDs of expanded items                       |
| `sourceEvent`                                                 | `string`        | Name of the event that triggered the action |
| (`"click"`, `"focus"`, `"drop"`, `"dragover"` or `undefined`) |

### select

This event is triggered when an item has been selected.

```html
<Finder :tree="tree" @select="onSelect" />
```

```js
onSelect({ selected }) {
  console.log(
    `Items with ${selected.join()} IDs are now selected`
  );
}
```

#### Properties

| Name       | Type            | Description           |
| ---------- | --------------- | --------------------- |
| `selected` | `Array<string>` | IDs of selected items |

### move

This event is triggered when an item has been moved by drag and drop.
When an item is dropped on a dropzone between two elements, a `index` is also provided.

```html
<Finder :tree="tree" @move="onMove" />
```

```js
onMove({ moved, to, index }) {
  console.log(
    `Item with ${moved} ID has been moved
    to its new parent with ${to} ID`
  );
}
```

#### Properties

| Name    | Type     | Description                                          |
| ------- | -------- | ---------------------------------------------------- |
| `moved` | `string` | ID of the moved item                                 |
| `to`    | `string` | ID of the parent on which the item has been moved to |
| `index` | `number` | Index of the dropzone                                |
