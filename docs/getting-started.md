# Getting Started

## Installation

Install this package with Yarn:

```sh
yarn add vue-finder

# Or, using npm
npm install --save vue-finder
```

## Basic usage

Then, import and use the component:

```html
<!-- Vue component (.vue) -->

<template>
  <div>
    <Finder :tree="tree"></Finder>
  </div>
</template>

<script>
  import { Finder } from "vue-finder";
  export default {
    components: {
      Finder
    },
    data() {
      return {
        tree: {
          id: "root",
          children: [
            {
              id: "child1",
              label: "Child 1"
            },
            {
              id: "child2",
              label: "Child 2"
            }
          ]
        }
      };
    }
  };
</script>
```

The component itself does not include any CSS. You'll need to include it separately:

```js
import "vue-finder/dist/vue-finder.css";
```

Alternatively, you can import the scss for complete control of the component styles:

```scss
@import "vue-select/src/scss/vue-select.scss";
```
