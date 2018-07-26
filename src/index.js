/*!
 * jquery-app <https://github.com/kasparsz/jquery-app>
 *
 * Copyright (c) 2016-2018, Kaspars Zuks.
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
    const REGEX_SPLIT = /(\s*,\s*|\s+)/;
    const REGEX_NOT_LOWERCASE = /[^a-z]/;
    const PROPERTY_NAME = 'jQueryAppData';

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
         * @param {object} $element jQuery element
         * @param {object?} [settings] jQuery App settings
         */
        call: function (element, settings = $.app.settings) {
            const $element = $(element);
            const plugins  = $.app.getPlugins($element, settings);
            let   data     = $element.data(PROPERTY_NAME);

            if (!data) {
                $element.data(PROPERTY_NAME, data = {});
            }

            plugins.forEach((plugin) => {
                // Eech plugin called only once on each element
                if (!data[plugin]) {
                    data[plugin] = true;

                    // As only argument pass plugin options
                    const options = $.app.getPluginOptions($element, plugin, settings);
                    $element[plugin](options);

                    if (settings.debug) {
                        console.log('$.app called plugin "%s" on %o with options %O', plugin, element, options);
                    }
                } else if (settings.debug) {
                    console.log('$.app skipped plugin "%s" on %o because it already has been called previously', plugin, element);
                }
            });
        },

        /**
         * Returns list of plugin names for element
         *
         * @param {object} $element jQuery element
         * @param {object?} [settings] jQuery App settings
         * @returns {array} List of plugin names
         */
        getPlugins: function ($element, settings = $.app.settings) {
            const plugins = $element.data(settings.namespace).split(REGEX_SPLIT);

            return plugins.filter((plugin) => {
                if (plugin) {
                    if (typeof $.fn[plugin] === 'function') {
                        return true;
                    } else if (settings.debug) {
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
         * @param {object?} [settings] jQuery App settings
         * @returns {object} Plugin options/settings
         */
        getPluginOptions: function ($element, plugin, settings = $.app.settings) {
            const options = {};
            const data    = $element.data();

            if (settings.namespaceOptions) {
                // Pass only data starting with data-PLUGIN
                for (let key in data) {
                    let value = data[key];

                    if (key === plugin) {
                        // data-PLUGIN="JSON"
                        $.extend(options, $.isPlainObject(value) ? value : {});
                    }  else if (key.indexOf(plugin) === 0 && key.substr(plugin.length, 1).match(REGEX_NOT_LOWERCASE)) {
                        // data-PLUGIN-PROPERTY="VALUE"
                        let name = key.substr(plugin.length);
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
         * @param {object} $element jQuery element
         * @param {string} plugin Plugin name
         * @param {object?} [settings] jQuery App settings
         * @returns {boolean} True if plugin is defined for element, otherwise false
         */
        hasPluginDefined: function ($element, plugin, settings = $.app.settings) {
            const plugins = $.app.getPlugins($element, settings);
            return plugins.indexOf(plugin) !== -1;
        },

        /**
         * Returns true if specific plugin has been called for element
         *
         * @param {object} $element jQuery element
         * @param {string} plugin Plugin name
         * @returns {boolean} True if plugin has been created for element, otherwise false
         */
        hasPlugin: function ($element, plugin) {
            const data = $element.data(PROPERTY_NAME);
            return !!(data && data[plugin]);
        }

    };


    /**
     * jQuery plugin to initialize all plugins
     *
     * @param {object?} settings jQuery App settings
     */
    $.fn.app = function (settings) {
        const appSettings = $.extend({}, $.app.settings, settings);
        const selector    = `[data-${ appSettings.namespace }]`;
        const $elements   = this.find(selector).addBack(selector);

        $elements.each((index, element) => $.app.call(element, appSettings));

        return this;
    };

}));
