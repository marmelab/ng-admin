/*global define*/

define(function () {
    'use strict';

    /**
     * Simple Javascript inheritance helper
     * @param {Object} child
     * @param {Object} parent
     */
    function inherits(child, parent) {
        var Wrapper = new Function();
        Wrapper.prototype = parent.prototype;

        child.prototype = new Wrapper();
        child.prototype.constructor = child;
    }

    /**
     * camelCase a string
     *
     * @see http://stackoverflow.com/questions/10425287/convert-string-to-camelcase-with-regular-expression
     * @param {String} input
     * @returns {string}
     */
    function camelCase(input) {
        return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
            return group1.toUpperCase();
        });
    }

    return {
        inherits: inherits,
        camelCase: camelCase
    };
});
