[npm-url]: https://npmjs.org/package/jquery-app
[npm-image]: http://img.shields.io/npm/v/jquery-app.svg
[travis-url]: https://travis-ci.org/kasparsz/jquery-app
[travis-image]: http://img.shields.io/travis/kasparsz/jquery-app.svg

# jquery-app
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

Declarative jQuery plugin initialization on DOM elements.
Finds elements, which has data-plugin attribute and calls jQuery plugins on them passing settings/options as first argument.

On repeated ```.app()``` calls if plugin already was initialized on the element then it will be ignored.

## Install

Install with [npm](https://www.npmjs.com/) or yarn:

```sh
$ npm install jquery-app --save
```
```sh
$ yarn add jquery-app
```

## Usage

List of plugins which will be called are defined by settings ```data-plugin="PLUGIN_NAMES"``` attribute on elements. Plugin names are either comma or space separated list of plugin names.

```html
<!-- data-PLUGIN_NAME="JSON_CONFIGURATION" -->
<input
    type="text"
    data-plugin="datepicker"
    />
```

### Plugin settings

Settings/options for plugin can be set either using ```data-PLUGIN_NAME="JSON_CONFIGURATION"``` attribute

```html
<!-- data-PLUGIN_NAME="JSON_CONFIGURATION" -->
<input
    type="text"
    data-plugin="datepicker"
    data-datepicker='{"numberOfMonths": 3, "showButtonPanel": true}'
    />
```

or specific ```data-PLUGIN_NAME-PROPERTY="VALUE"``` attribute

```html
<input
    type="text"
    data-plugin="datepicker"
    data-datepicker-number-of-months="3"
    data-datepicker-show-button-panel="true"
    />
```

In this example under the hood jquery-app will call plugin passing options as
```js
$(INPUT_ELEMENT).datepicker({
    "numberOfMonths": 3,
    "showButtonPanel": true
});
```

### Call jquery-app to initialize plugins

```js
$(function () {
    // Find all elements with data-plugin attribute inside body and initialize plugins
    $('body').app();
});
```

In some cases you may want to use different attribute name than ```data-plugin```, that can be done using ```namespace``` property when calling ```$.fn.app```

```js
$(function () {
    // Find all elements with data-attach attribute inside body and initialize plugins
    $('body').app({
        'namespace': 'attach'
    });
});
```

### Multiple plugin support

Multiple plugins can be defined using space or comma separated list and since options are prefixed there won't be collision between options/settings for each plugin.

```html
<div
    data-plugin="pluginA, pluginB"
    data-pluginA-option-a="alpha"
    data-pluginA-option-b="beta"
    data-pluginB-option-a="gamma"
    data-pluginB-option-c="delta"
    ></div>
```

Under the hood jquery-app will call plugins as
```js
$(DIV_ELEMENT).pluginA({
    "optionA": "alpha",
    "optionB": "beta"
});
$(DIV_ELEMENT).pluginB({
    "optionA": "gamma",
    "optionC": "delta"
});
```


## API

#### `$.app.settings` / `$.fn.app([settings])`


### Options

| Name     | Type    | Usage                                    | Default  |
| -------- | ------- | ---------------------------------------- | -------- |
| namespace    | String | Data attribute name using which list of plugin names are defined | ```"plugin"```     |
| namespaceOptions    | Boolean | Pass to plugin only data from attributes starting with plugin name, eg. data-datepicker. If set to false all data is passed to plugin as ```options``` and without removing prefixes | ```true```     |
| debug    | Boolean or String | Output all successful and failed plugin initialization calls to the console. If value is "error" then output only failed plugin initialization calls | ```false```     |


#### namespaceOptions 

Using `namespaceOptions: true` (default)
```html
<div data-plugin="datepicker" data-datepicker-number-of-months="3">
```

Using `namespaceOptions: false`
```html
<div data-plugin="datepicker" data-number-of-months="3">
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## License

Copyright © 2018, [Kaspars Zuks](https://github.com/kasparsz).
Released under the [MIT license](https://github.com/kasparsz/jquery-app/blob/master/LICENSE).

[npm-url]: https://npmjs.org/package/jquery-app
[npm-image]: http://img.shields.io/npm/v/jquery-app.svg
[travis-url]: https://travis-ci.org/kasparsz/jquery-app
[travis-image]: http://img.shields.io/travis/kasparsz/jquery-app.svg
