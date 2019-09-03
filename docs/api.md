# API

## Props

| Prop name   | Type    | Default   | Description                         |
| ----------- | ------- | --------- | ----------------------------------- |
| tree        | object  |           | Data of the tree.                   |
| selectable  | boolean | false     | Enable the selection of items.      |
| dragEnabled | boolean | false     | Enable the drag & drop of items.    |
| filter      | func    | undefined | Function to filter displayed items. |

## Events

### `expand`

This event is triggered when an item has been expanded.

```html
<Finder :tree="tree" @expand="onExpand" />
```

```js
onExpand({ expanded }) {
  console.log(
    `Items with ${expanded.join()} IDs are now expanded`
  );
}
```

**Properties:**

- **expanded** - `Array<string>`: IDs of expanded items

### `select`

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

**Properties:**

- **selected** - `Array<string>`: IDs of selected items

### `move`

This event is triggered when an item has been moved by drag and drop.

```html
<Finder :tree="tree" @move="onMove" />
```

```js
onMove({ moved, to }) {
  console.log(
    `Item with ${moved} ID has been moved
    to its new parent with ${to} ID`
  );
}
```

**Properties:**

- **moved** - `string`: ID of the moved item
- **to** - `string`: ID of the parent on which the item has been moved to
