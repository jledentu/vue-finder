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

```js
import { Finder } from "vue-finder";
export default {
  components: {
    Finder
  }
};
```

The component itself does not include any CSS. You'll need to include it separately:

```js
import "vue-finder/dist/vue-finder.css";
```

Alternatively, you can import the scss for complete control of the component styles:

```scss
@import "vue-select/src/scss/vue-select.scss";
```
