'use strict';

require('mocha');
var assert = require('assert');

var fs = require('fs');
var jsdom = require('jsdom');

var jQuery = fs.readFileSync('./node_modules/jquery/dist/jquery.js', "utf-8");
var jQueryApp = fs.readFileSync('./dist/jquery-app.js', "utf-8");

function createTestEnv(fn) {
    return function (done) {
        jsdom.env('<html><body></body></html>', {
            src: [jQuery, jQueryApp],
            done: function (err, window) {
                if (err) throw err; // everything should fail

                fn(done, window.$);
                window.close(); // clean up memory
            }
        });
    };
}

describe('jquery-app', function(done) {

    it('$.fn.app plugin exists', createTestEnv(function (done, $) {
        assert.equal(typeof $.fn.app, 'function');
        done();
    }));

    it('should call plugin', createTestEnv(function (done, $) {
        var foo = 0;
        var bar = 0;

        $.fn.foo = function () { foo++; };
        $.fn.bar = function () { bar++; };

        $('body').append('<div data-plugin="foo"><span data-plugin="bar"></span></div>').app();

        assert.equal(foo, 1);
        assert.equal(bar, 1);
        done();
    }));

    it('should call plugin only once', createTestEnv(function (done, $) {
        var foo = 0;

        $.fn.foo = function () { foo++; };

        $('body').append('<div data-plugin="foo"><span data-plugin="bar"></span></div>').app().app();

        assert.equal(foo, 1);
        done();
    }));

    it('should have options object', createTestEnv(function (done, $) {

        $.fn.test = function (options) {
            assert.equal(typeof options, 'object');
            assert.equal(Object.keys(options).length, 0);
            done();
        };

        $('body').append('<div data-plugin="test"></div>').app();
    }));

    it('should pass options from data-PLUGIN attribute', createTestEnv(function (done, $) {

        $.fn.test = function (options) {
            assert.equal(options.name, 'John');
            assert.equal(options.age, 21);
            done();
        };

        $('body').append('<div data-plugin="test" data-test=\'{"name": "John", "age": 21}\'></div>').app();
    }));

    it('should pass options from data-PLUGIN-PROPERTY attributes', createTestEnv(function (done, $) {

        $.fn.test = function (options) {
            assert.equal(options.name, 'John');
            assert.equal(options.age, 21);
            done();
        };

        $('body').append('<div data-plugin="test" data-test-name="John" data-test-age="21"></div>').app();
    }));

});
