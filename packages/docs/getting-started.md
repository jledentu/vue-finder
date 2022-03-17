# Getting Started

## Installation

Install this package with Yarn:

```sh
yarn add @jledentu/vue-finder

# Or, using npm
npm install --save @jledentu/vue-finder
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
  import { Finder } from "@jledentu/vue-finder";
  export default {
    components: {
      Finder,
    },
    data() {
      return {
        tree: {
          id: "root",
          children: [
            {
              id: "child1",
              label: "Child 1",
            },
            {
              id: "child2",
              label: "Child 2",
            },
          ],
        },
      };
    },
  };
</script>
```

The component itself does not include any CSS. You'll need to include it separately:

```js
import "@jledentu/vue-finder/dist/vue-finder.css";
```
