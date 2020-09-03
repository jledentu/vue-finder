<div align="center" markdown="1">

![Vue Finder](./logo.svg)

**A Vue.js component to display hierarchical data (like the MacOS X finder)**

[![Build Status](https://travis-ci.org/jledentu/vue-finder.svg?branch=master)](https://travis-ci.org/jledentu/vue-finder)
[![Npm badge](https://img.shields.io/npm/v/@jledentu/vue-finder.svg)](https://www.npmjs.com/package/@jledentu/vue-finder)
[![Codecov](https://img.shields.io/codecov/c/github/jledentu/vue-finder.svg)](https://codecov.io/gh/jledentu/vue-finder)
[![CodeFactor](https://www.codefactor.io/repository/github/jledentu/vue-finder/badge/master)](https://www.codefactor.io/repository/github/jledentu/vue-finder/overview/master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

![Screenshot](./screenshot.png)

</div>

## Documentation

The documentation is available on the [website](https://vue-finder.netlify.app/).

## Getting Started

```sh
npm install --save @jledentu/vue-finder
```

An example of Vue Single File component:

```html
<template>
  <Finder :tree="tree" />
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
              id: "fruits",
              label: "Fruits",
              children: [
                {
                  id: "apple",
                  label: "Apple",
                  selectable: false,
                },
                {
                  id: "banana",
                  label: "Banana",
                },
                {
                  id: "grape",
                  label: "Grape",
                  selected: true,
                },
                {
                  id: "lemon",
                  label: "Lemon",
                  selectable: false,
                },
                {
                  id: "orange",
                  label: "Orange",
                  selected: true,
                },
              ],
            },
            {
              id: "vegetables",
              label: "Vegetables",
              children: [
                {
                  id: "bean",
                  label: "Beans",
                },
                {
                  id: "carrot",
                  label: "Carrot",
                  selected: true,
                },
                {
                  id: "eggplant",
                  label: "Eggplant",
                  selectable: false,
                },
                {
                  id: "parsnip",
                  label: "Parsnip",
                },
                {
                  id: "tomato",
                  label: "Tomato",
                  selectable: false,
                },
              ],
            },
          ],
        },
      };
    },
  };
</script>

<style src="@jledentu/vue-finder/dist/vue-finder.css" />
```

### Browser

You can also include the standalone UMD build in your page from the jsdeliver CDN. Make sure to import Vue as a dependency before vue-finder.

```html
<html>
  <head>
    <!-- Include Vue 2.x -->
    <script src="https://cdn.jsdelivr.net/npm/vue@^2"></script>
    <!-- Include vue-finder & its styles -->
    <script src="https://cdn.jsdelivr.net/npm/@jledentu/vue-finder@1.20.0/dist/vue-finder.min.js"></script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@jledentu/vue-finder@1.20.0/dist/vue-finder.css"
    />
  </head>

  <body>
    <div id="app">
      <finder :tree="tree" />
    </div>
  </body>
  <script>
    new Vue({
      el: "#app",
      data: {
        tree: {
          id: "root",
          children: [
            {
              id: "fruits",
              label: "Fruits",
              children: [
                {
                  id: "apple",
                  label: "Apple",
                  selectable: false,
                },
                {
                  id: "banana",
                  label: "Banana",
                },
                {
                  id: "grape",
                  label: "Grape",
                  selected: true,
                },
                {
                  id: "lemon",
                  label: "Lemon",
                  selectable: false,
                },
                {
                  id: "orange",
                  label: "Orange",
                  selected: true,
                },
              ],
            },
            {
              id: "vegetables",
              label: "Vegetables",
              children: [
                {
                  id: "bean",
                  label: "Beans",
                },
                {
                  id: "carrot",
                  label: "Carrot",
                  selected: true,
                },
                {
                  id: "eggplant",
                  label: "Eggplant",
                  selectable: false,
                },
                {
                  id: "parsnip",
                  label: "Parsnip",
                },
                {
                  id: "tomato",
                  label: "Tomato",
                  selectable: false,
                },
              ],
            },
          ],
        },
      },
    });
  </script>
</html>
```

## Changelog

See the GitHub [release history](https://github.com/jledentu/vue-finder/releases).

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

### Development scripts

- `yarn build` to build the library
- `yarn test` to run the unit tests
- `yarn storybook` to run the [Storybook](https://github.com/storybookjs/storybook) in watch mode
- `yarn docs:dev` to run the [Vuepress](https://github.com/vuejs/vuepress) documentation in watch mode

## Credits

- [Lodash](https://lodash.com/) for some utility functions
- [Vue-treeselect](https://vue-treeselect.js.org/), [Vue-data-tables](https://www.njleonzhang.com/vue-data-tables) and [Vue-multiselect](https://vue-multiselect.js.org) as inspiration for naming and documentation

## License

[MIT](https://choosealicense.com/licenses/mit/)
