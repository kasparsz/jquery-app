/*!
 * jquery-app <https://github.com/kasparsz/jquery-app>
 *
 * Copyright (c) 2016-2020, Kaspars Zuks.
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
    var LEVEL_ERROR = 'error';

    $.app = {

        /*
         * Default $.app settings
         */
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
         * @param {object} element HTML Element or jQuery element
         * @param {object?} [settings] jQuery App settings
         * @param {string?} [pluginNames] List of plugins which to call, if not specified all plugins will be called
         */
        call: function (element, settings, pluginNames) {
            if ( settings === void 0 ) settings = $.app.settings;
            if ( pluginNames === void 0 ) pluginNames = null;

            var $element = $(element);
            var plugins  = pluginNames || $.app.getPlugins($element, settings);
            var   data     = $element.data(PROPERTY_NAME);

            if (!data) {
                $element.data(PROPERTY_NAME, data = {});
            }

            plugins.forEach(function (plugin) {
                // Eech plugin called only once on each element
                if (!data[plugin]) {
                    data[plugin] = true;

                    // As only argument pass plugin options
                    var options = $.app.getPluginOptions($element, plugin, settings);
                    $element[plugin](options);

                    if (settings.debug && settings.debug !== LEVEL_ERROR) {
                        console.log('$.app called plugin "%s" on %o with options %O', plugin, element, options);
                    }
                } else if (settings.debug && settings.debug !== LEVEL_ERROR) {
                    console.log('$.app skipped plugin "%s" on %o because it already has been called previously', plugin, element);
                }
            });
        },

        /**
         * Returns list of plugin names for element
         *
         * @param {object} element HTML Element or jQuery element
         * @param {object?} [settings] jQuery App settings
         * @returns {array} List of plugin names
         */
        getPlugins: function (element, settings) {
            if ( settings === void 0 ) settings = $.app.settings;

            var plugins = ($(element).data(settings.namespace) || '').split(REGEX_SPLIT);

            return plugins.filter(function (plugin) {
                if (plugin.trim()) {
                    if (typeof $.fn[plugin] === 'function') {
                        return true;
                    } else if (settings.debug) {
                        console.error('$.app coundn\'t find jQuery plugin "%s" declared on element %o', plugin, $(element).get(0));
                    }
                }

                return false;
            });
        },

        /**
         * Returns list of options/settings for specific plugin for element
         *
         * @param {object} element HTML Element or jQuery element
         * @param {string} plugin Plugin name
         * @param {object?} [settings] jQuery App settings
         * @returns {object} Plugin options/settings
         */
        getPluginOptions: function (element, plugin, settings) {
            if ( settings === void 0 ) settings = $.app.settings;

            var options = {};
            var data    = $(element).data();

            if (settings.namespaceOptions) {
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
        },

        /**
         * Returns true if element has a specific plugin defined as data-... attribute
         *
         * @param {object} element HTML Element or jQuery element
         * @param {string} plugin Plugin name
         * @param {object?} [settings] jQuery App settings
         * @returns {boolean} True if plugin is defined for element, otherwise false
         */
        hasPluginDefined: function (element, plugin, settings) {
            if ( settings === void 0 ) settings = $.app.settings;

            var plugins = $.app.getPlugins(element, settings);
            return plugins.indexOf(plugin) !== -1;
        },

        /**
         * Returns true if specific plugin has been called for element
         *
         * @param {object} element HTML Element or jQuery element
         * @param {string} plugin Plugin name
         * @returns {boolean} True if plugin has been created for element, otherwise false
         */
        hasPlugin: function (element, plugin) {
            var data = $(element).data(PROPERTY_NAME);
            return !!(data && data[plugin]);
        }

    };


    /**
     * jQuery plugin to initialize all plugins
     *
     * @param {object?} [settings] jQuery App settings
     * @param {array} [plugins] List of plugins which to call, if not specified all plugins will be called
     */
    $.fn.app = function (settings, plugins) {
        if (Array.isArray(settings)) {
            plugins = settings;
            settings = {};
        }

        var appSettings = $.extend({}, $.app.settings, settings);
        var selector    = "[data-" + (appSettings.namespace) + "]";
        var $elements   = this.find(selector).addBack(selector);

        $elements.each(function (index, element) { return $.app.call(element, appSettings, plugins); });

        return this;
    };

}));
