'use strict';

require('mocha');
var assert = require('assert');

var fs = require('fs');
var jsdom = require('jsdom');

var jQuery = fs.readFileSync('./node_modules/jquery/dist/jquery.js', 'utf-8');
var jQueryApp = fs.readFileSync('./dist/jquery-app.js', 'utf-8');

function createTestEnv(fn) {
    return function (done) {
        var dom = new jsdom.JSDOM('<html><body></body></html>', {'runScripts': 'dangerously'});
        var window = dom.window;

        var script = window.document.createElement('script');
        script.textContent = jQuery;
        window.document.body.appendChild(script);

        var script = window.document.createElement('script');
        script.textContent = jQueryApp;
        window.document.body.appendChild(script);

        fn(done, window.$);
        window.close(); // clean up memory
    };
}


describe('jquery-app', function(done) {

    it('$.fn.app plugin exists', createTestEnv(function (done, $) {
        assert.equal(typeof $.fn.app, 'function');
        done();
    }));

    it('should call multiple plugins separated by comma', createTestEnv(function (done, $) {
        var foo = 0;
        var bar = 0;

        $.fn.foo = function () { foo++; };
        $.fn.bar = function () { bar++; };

        $('body').append('<div data-plugin="foo, bar"></div>').app();

        assert.equal(foo, 1);
        assert.equal(bar, 1);
        done();
    }));

    it('should call multiple plugins separated by whitespace', createTestEnv(function (done, $) {
        var foo = 0;
        var bar = 0;

        $.fn.foo = function () { foo++; };
        $.fn.bar = function () { bar++; };

        $('body').append('<div data-plugin="foo bar"></div>').app();

        assert.equal(foo, 1);
        assert.equal(bar, 1);
        done();
    }));

    it('should call multiple plugins on same element', createTestEnv(function (done, $) {
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

    it('should pass options to all plugins', createTestEnv(function (done, $) {
        var foo = false;
        var bar = false;

        $.fn.foo = function (options) {
            assert.equal(options.name, 'John');
            foo = true;
        };
        $.fn.bar = function (options) {
            assert.equal(options.name, 'Jane');
            bar = true;
        };

        $('body').append('<div data-plugin="foo, bar" data-foo-name="John" data-bar=\'{"name": "Jane"}\'></div>').app();

        assert.equal(foo, true);
        assert.equal(bar, true);
        done();
    }));

});
