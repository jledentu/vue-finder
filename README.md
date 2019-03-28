# vue-finder

[![Build Status](https://travis-ci.org/jledentu/vue-finder.svg?branch=master)](https://travis-ci.org/jledentu/vue-finder)
[![CodeFactor](https://www.codefactor.io/repository/github/jledentu/vue-finder/badge/master)](https://www.codefactor.io/repository/github/jledentu/vue-finder/overview/master)
![Vue](https://img.shields.io/badge/Vue-^2.5.13-brightgreen.svg)
![Commitizen](https://img.shields.io/badge/Commitizen-enabled-brightgreen.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![Npm badge](https://img.shields.io/npm/v/vue-finder.svg)

---

A Vue.js component to display hierarchical data (like the MacOS X finder).

## Installation

```
npm install --save vue-finder
```

vue-finder can be used as a module in both CommonJS and ES module environments.
When in non-modular environment, vue-finder will register all the components to vue by itself.

### ES6

```js
import { Finder } from 'vue-finder';

export default {
  ...
  components: {
    Finder
  },
  ...
};
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
