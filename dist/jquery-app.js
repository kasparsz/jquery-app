/*!
 * jquery-app <https://github.com/kasparsz/jquery-app>
 *
 * Copyright (c) 2016-2017, Kaspars Zuks.
 * Licensed under the MIT License.
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
    }
}(function ($) {
    var REGEX_SPLIT = /(\s*,\s*|\s+)/;
    var REGEX_NOT_LOWERCASE = /[^a-z]/;
    var PROPERTY_NAME = 'jQueryAppData';

    $.app = {
        settings: {
            // data attribute, which will be used to read list of plugin names
            'namespace': 'plugin',

            // Pass to plugin only data from data-PLUGIN... attributes
            'namespaceOptions': true,

            // Debug mode
            'debug': false
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

                    if ($.app.settings.debug) {
                        console.log('$.app called plugin "%s" on %o with options %O', plugin, element, options);
                    }
                } else if ($.app.settings.debug) {
                    console.log('$.app skipped plugin "%s" on %o because it already has been called previously', plugin, element);
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
                if (plugin) {
                    if (typeof $.fn[plugin] === 'function') {
                        return true;
                    } else if ($.app.settings.debug) {
                        console.error('$.app coundn\'t find jQuery plugin "%s" declared on element %o', plugin, $element.get(0));
                    }
                }

                return false;
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
            var options = {};
            var data    = $element.data();

            if ($.app.settings.namespaceOptions) {
                // Pass only data starting with data-PLUGIN
                for (var key in data) {
                    var value = data[key];

                    if (key === plugin) {
                        // data-PLUGIN="JSON"
                        $.extend(options, $.isPlainObject(value) ? value : {});
                    }  else if (key.indexOf(plugin) === 0 && key.substr(plugin.length, 1).match(REGEX_NOT_LOWERCASE)) {
                        // data-PLUGIN-PROPERTY="VALUE"
                        var name = key.substr(plugin.length);
                        name = name[0].toLowerCase() + name.substr(1);

                        options[name] = value;
                    }
                }
            } else {
                // Pass all data into options
                $.extend(options, data);
            }

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

}));
