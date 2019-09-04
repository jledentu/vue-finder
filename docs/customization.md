# Customization

Vue Finder provides some options to customize its look.

## Item component

You can define a component to render items with the `itemComponent` prop. This component requires a `item` prop, that will
receive the data of the rendered item.

```html
<Finder :tree="tree" :itemComponent="itemComponent" />
```

```js
// ...
data() {
  return {
    itemComponent: {
      props: ["item"],
      template:
        '<div style="color: blue"><em>Name:</em> <strong>{{ item.label }}</strong></div>'
    }
  }
}
```

<FinderExample :useCustomItemComponent="true"/>

::: warning

The example above uses the `template` option to define the rendering of the component, so
the [runtime compiler](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only) is needed.

You can also use a `render` function (in this case the runtime-only build is enough):

```js
itemComponent: {
  props: ["item"],
  render(h) {
    return h('div', this.item)
  }
}
```

:::
