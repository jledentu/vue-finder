# Customization

Vue Finder provides some options to customize its look.

## CSS classes

You can pass CSS classes to each item component by setting `cssClass`:

```html
<Finder :tree="tree" />
```

```js
const tree = {
  id: "root",
  children: [
    {
      id: "fruits",
      label: "Fruits",
      cssClass: "my-item fruits",
      children: [
        { id: "apple", label: "Apple" },
        // ...
      ],
    },
    {
      id: "vegetables",
      label: "Vegetables",
      cssClass: "my-item vegetables",
      children: [
        { id: "bean", label: "Beans" },
        // ...
      ],
    },
  ],
};
```

## Theming

The `Finder` component accepts a `theme` prop that allows to customize some CSS properties:

```html
<Finder :tree="tree" :theme="theme" />
```

```js
// ...
data() {
  return {
    theme: {
      primaryColor: "#0b79d0",
      arrowColor: "black",
      separatorColor: "#ccc",
      separatorWidth: "1px",
      dropZoneBgColor: "rgba(33, 150, 243, 0.2)",
      draggedItemBgColor: "rgba(33, 150, 243, 0.5)"
    }
  }
}
```

Here are the available properties:

| Name                 | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `primaryColor`       | Primary color used for expanded items, dropzone borders...   |
| `arrowColor`         | Color of arrows in expandable items                          |
| `separatorColor`     | Border color of separators between lists                     |
| `separatorWidth`     | Width value of separators between lists                      |
| `dropZoneBgColor`    | Background color of drop zones (visible when Drag & Drop)    |
| `draggedItemBgColor` | Background color of dragged items (visible when Drag & Drop) |

## Custom slots

You can pass scoped slots in order to customize some parts of the UI.

### Item

You can use the `item` scoped slot to render items. This slot accepts the following props:

- `item`: the data of the item
- `expanded`: the expanded state of the item
- `dragged`: whether the item is currently dragged

```html
<Finder :tree="tree">
  <template #item="{ item }">
    <div style="color: blue">
      <em>Name:</em> <strong>{{ item.label }}</strong>
    </div>
  </template>
</Finder>
```

<FinderExample :use-custom-item-slot="true"/>

### Arrow

You can use the `arrow` scoped slot to render custom arrows. This slot accepts the following props:

- `expanded`: the expanded state of the item
- `item`: the data of the item
- `theme`: the theme applied on the `Finder`

```html
<Finder :tree="tree">
  <template #arrow="{ expanded }">
    <div>{{ expanded ? '↪' : '→' }}</div>
  </template>
</Finder>
```

<FinderExample :use-custom-arrow-slot="true" />
