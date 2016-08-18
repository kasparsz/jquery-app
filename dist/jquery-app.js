/*!
 * jquery-app <https://github.com/kasparsz/jquery-app>
 *
 * Copyright (c) 2016, Kaspars Zuks.
 * Licensed under the MIT License.
 */

(function (global) {
    var $ = global.jQuery || window.jQuery;
    var REGEX_SPLIT = /\s*,\s*/;
    var REGEX_NOT_LOWERCASE = /[^a-z]/;
    var PROPERTY_NAME = 'jQueryAppData';

    $.app = {
        settings: {
            'namespace': 'plugin'
        },

        /**
         * Call all plugins for element
         *
         * @param {object} $element jQuery element
         */
        call: function (element) {
            var $element = $(element);
            var plugins  = $.app.getPlugins($element);
            var   data     = $element.data(PROPERTY_NAME);

            if (!data) {
                $element.data(PROPERTY_NAME, data = {});
            }

            plugins.forEach(function (plugin) {
                // Eech plugin called only once on each element
                if (!data[plugin]) {
                    data[plugin] = true;

                    // As only argument pass plugin options
                    var options = $.app.getPluginOptions($element, plugin);
                    $element[plugin](options);
                }
            });
        },

        /**
         * Returns list of plugin names for element
         *
         * @param {object} $element jQuery element
         * @returns {array} List of plugin names
         */
        getPlugins: function ($element) {
            var plugins = $element.data($.app.settings.namespace).split(REGEX_SPLIT);

            return plugins.filter(function (plugin) {
                return (typeof $.fn[plugin] === 'function');
            });
        },

        /**
         * Returns list of options/settings for specific plugin for element
         *
         * @param {object} $element jQuery element
         * @param {string} plugin Plugin name
         * @returns {object} Plugin options/settings
         */
        getPluginOptions: function ($element, plugin) {
            // data-PLUGIN="VALUE",  data-PLUGIN-PROPERTY="VALUE"
            var attrs   = $element.get(0).attributes;
            var prefix  = "data-" + plugin;
            var options = {};

            var data    = $element.data();

            for (var key in data) {
                var value = data[key];

                if (key === plugin) {
                    $.extend(options, value);
                }  else if (key.indexOf(plugin) === 0 && key.substr(plugin.length, 1).match(REGEX_NOT_LOWERCASE)) {
                    var name = key.substr(plugin.length);
                    name = name[0].toLowerCase() + name.substr(1);

                    options[name] = value;
                }
            }

            /*
            for (let i = 0, ii = attrs.length; i < ii; i++) {
                let name = attrs[i].name;

                if (name === prefix) {
                    // data-PLUGIN="JSON"
                    $.extend(options, $element.data(plugin));
                } else if (name.indexOf(prefix + '-') === 0) {
                    // data-PLUGIN-PROPERTY="VALUE"
                    let prop = name.substr(prefix.length + 1); // attribute name without "data-plugin-"
                    options[$.camelCase(prop)] = value;
                }
            }
            */

            return options;
        }

    };


    /**
     * jQuery plugin to initialize all plugins
     *
     * @param {object?} options jQuery App settings
     */
    $.fn.app = function (options) {
        var settings  = $.extend($.app.settings, options);
        var selector  = "[data-" + (settings.namespace) + "]";
        var $elements = this.find(selector).addBack(selector);

        $elements.each(function (index, element) { return $.app.call(element); });

        return this;
    };

})(this);
