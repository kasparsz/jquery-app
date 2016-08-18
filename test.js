'use strict';

require('mocha');
var assert = require('assert');

var fs = require('fs');
var jsdom = require('jsdom');
var jQuery = fs.readFileSync('./node_modules/jquery/dist/jquery.js', "utf-8");
var generate = require('./dist/jquery-app.js');

function createTestEnv(fn) {
    return function (done) {
        jsdom.env('', {
            src: [jQuery],
            done: function (err, window) {
                if (err) throw err; // everything should fail
                fn(done, window.$);
                window.close(); // clean up memory
            }
        });
    };
}

describe('jquery-app', function(done) {



});
