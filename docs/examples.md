# Examples

## Basic example

The `Finder` component requires a `tree` prop, for example:

```js
const tree = {
  id: "root",
  children: [
    {
      id: "fruits",
      label: "Fruits",
      children: [
        { id: "apple", label: "Apple" }
        // ...
      ]
    },
    {
      id: "vegetables",
      label: "Vegetables",
      children: [
        { id: "bean", label: "Beans" }
        // ...
      ]
    }
  ]
};
```

<FinderExample></FinderExample>

## Selection

You can enable the selection of items with `selectable`:

```html
<Finder :tree="tree" :selectable="true"></Finder>
```

All items are then selectable by default, but you can prevent the selection of a given item by setting `selectable: false`:

```js
{
  id: "vegetables",
  label: "Vegetables",
  selectable: false
}
```

<FinderExample :selectable="true"></FinderExample>

## Filtering

You can filter displayed items by defining the `filter` prop:

```html
<Finder :tree="tree" :filter="filter"></Finder>
```

Where `filter` is a `Function` that takes an item as argument, and should return `true` if this item must be displayed.

```js
const filter = item => item.id === "apple";
```

<FinderExample :filter="item => item.id === 'apple'"></FinderExample>

## Drag and drop

You can enable the drag and drop of items with `dragEnabled`:

```html
<Finder :tree="tree" :dragEnabled="true"></Finder>
```

<FinderExample :dragEnabled="true"></FinderExample>
