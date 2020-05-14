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
        { id: "apple", label: "Apple" }
        // ...
      ]
    },
    {
      id: "vegetables",
      label: "Vegetables",
      cssClass: "my-item vegetables",
      children: [
        { id: "bean", label: "Beans" }
        // ...
      ]
    }
  ]
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

## Custom components

You can pass your own components in order to customize some parts of the UI.

### Item component

You can define a component to render items with the `itemComponent` prop. This component requires a `item` prop, that will
receive the data of the rendered item.

```html
<Finder :tree="tree" :item-component="itemComponent" />
```

```js
// ...
data() {
  return {
    itemComponent: {
      props: ["item"],
      template:
        "<div style="color: blue"><em>Name:</em> <strong>{{ item.label }}</strong></div>"
    }
  }
}
```

<FinderExample :use-custom-item-component="true"/>

::: warning

The example above uses the `template` option to define the rendering of the component, so
the [runtime compiler](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only) is needed.

You can also use a `render` function (in this case the runtime-only build is enough):

```js
itemComponent: {
  props: ["item"],
  render(h) {
    return h("div", this.item)
  }
}
```

:::

### Arrow component

You can define a component to render arrows with the `arrowComponent` prop. This component accepts the following props:

- `expanded`: the expanded state of the item
- `item`: the data of the item
- `theme`: the theme applied on the `Finder`

```html
<Finder :tree="tree" :arrow-component="arrowComponent" />
```

```js
// ...
data() {
  return {
    arrowComponent: {
      props: ["expanded", "item", "theme"],
      template:
        "<div>{{ expanded ? '↪' : '→' }}</div>"
    }
  }
}
```

<FinderExample :use-custom-arrow-component="true" />
