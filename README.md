# vue-finder

![Rollup badge](https://img.shields.io/badge/Rollup-^0.53.3-ff69b4.svg)
![Jest](https://img.shields.io/badge/Jest-^22.0.4-blue.svg)
![Vue](https://img.shields.io/badge/Vue-^2.5.13-brightgreen.svg)
![Storybook](https://img.shields.io/badge/Storybook-^3.3.3-ff70a3.svg)
![Commitizen](https://img.shields.io/badge/Commitizen-enabled-brightgreen.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![Npm badge](https://img.shields.io/npm/v/vue-finder.svg)
[![Build Status](https://travis-ci.org/jledentu/vue-finder.svg?branch=master)](https://travis-ci.org/jledentu/vue-finder)

> Generated using [vue-cli-template-library](https://github.com/julon/vue-cli-template-library).

## Installation

```
npm install vue-finder
```

vue-finder can be used as a module in both CommonJS and ES module environments.
When in non-modular environment, vue-finder will register all the components to vue by itself.

### ES6

```js
//
// You can register a component manually
//
import { Finder } from 'vue-finder';

export default {
  ...
  components: {
    Finder
  },
  ...
};

//
// or register the whole module with vue
//
import VueFinder from 'vue-finder';

// Install this library
Vue.use(VueFinder);
```

### CommonJS

```js
//
// You can register a component manually
//
var Vue = require('vue');
var VueFinder = require('vue-finder');

var YourComponent = Vue.extend({
  ...
  components: {
    'vue-finder': VueFinder.Finder
  },
  ...
});

//
// or register the whole module with vue
//
var Vue = require('vue');
var VueFinder = require('vue-finder');

// Install this library
Vue.use(VueFinder);
```

### Browser

```html
<script src="path/to/vue/vue.min.js"></script>
<script src="path/to/vue-finder/dist/vue-finder.min.js"></script>
<!-- Components are registered globally -->
```

### After that, you can use it in your templates:

```html
<vue-finder></vue-finder>
```

## Changelog

See the GitHub [release history](https://github.com/jledentu/vue-finder/releases).
