### Overviews:
Some JavaScript Notes:

### JavaScript Modules Systems | CJS vs AMD vs UMD vs EMD:

1. `CJS` => Common JS is a module system adopted by `Node.js` and used on the `server-side`. CJS allows for the `import` and `export` of modules using `require` and `module.exports`. This enables modules to be loaded `synchronously` and provides a simple syntax.
```js
const express = require('express');
```

2. `AMD` or Asynchronous Module Definition is for browser-based applications. It provides asynchronous module loading support (performance). Modules are defined and imported using `define` and `require` functions.

```js
require(['jquery', 'domReady!'], function ($) {
  $('body').append('<p>Hello World!</p>');
});
```

3. `UMD` or Universal Module Definition. It supports both CommonJS and AMD module systems. This allows modules to work in different environments. UMD is suitable for applications running both in browsers and on the server-side.

```js
const _ = require('lodash');

const array = [1, 2, 3, 4, 5];
const reversedArray = _.reverse(array);

console.log(reversedArray); // [5, 4, 3, 2, 1]
```

4. `ESM` or ECMAScript Module, is considered the official module system of JavaScript and is natively supported in modern browsers. 

ESM allows for the `import` and `export` of modules using `import` and `export` keywords. This provides more opportunities for optimizations such as static analysis and tree shaking. Additionally, ESM offers asynchronous module loading support.

```js
// main.js
import Vue from 'vue';

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
});
```

### Terms:
`“batteries included”` => the product/library/framework comes together (built in) with all possible parts/extensions required for full usability. So no need to install 3rd party extension.  