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

    return {
        inherits: inherits
    }
});
