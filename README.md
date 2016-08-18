[npm-url]: https://npmjs.org/package/jquery-app
[npm-image]: http://img.shields.io/npm/v/jquery-app.svg
[travis-url]: https://travis-ci.org/kasparsz/jquery-app
[travis-image]: http://img.shields.io/travis/kasparsz/jquery-app.svg

# jquery-app
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

Declarative jQuery plugin initialization on DOM elements.
Finds elements, which has data-plugin attribute and calls plugins on them passing settings/options as first argument.

On repeated ```.app()``` calls if plugin already was initialized on the element then it will be ignored.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install jquery-app --save
```

## Usage

```html
<!-- Options for plugin can be set either using data-PLUGIN="JSON" -->
<input
    type="text"
    data-plugin="datepicker"
    data-datepicker='{"numberOfMonths": 3, "showButtonPanel": true}'
    />

<!-- or specific data-PLUGIN-PROPERTY="VALUE" attribute -->
<input
    type="text"
    data-plugin="datepicker"
    data-datepicker-number-of-months="3"
    data-datepicker-show-button-panel="true"
    />
```

```js
$(function () {
    // Find all data-plugin elements inside body and initialize plugins
    $('body').app();
});
```

## API

#### `app([options])`


### Options

| Name     | Type    | Usage                                    | Default  |
| -------- | ------- | ---------------------------------------- | -------- |
| namespace    | String | Data attribute name from which read list of plugin names | "plugin"     |

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## License

Copyright © 2016, [Kaspars Zuks](https://github.com/kasparsz).
Released under the [MIT license](https://github.com/kasparsz/jquery-app/blob/master/LICENSE).

[npm-url]: https://npmjs.org/package/jquery-app
[npm-image]: http://img.shields.io/npm/v/jquery-app.svg
[travis-url]: https://travis-ci.org/kasparsz/jquery-app
[travis-image]: http://img.shields.io/travis/kasparsz/jquery-app.svg
