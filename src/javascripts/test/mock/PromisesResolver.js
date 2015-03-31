/*global jasmine,define*/

define('mock/PromisesResolver', ['mixins'], function (mixins) {
    "use strict";

    return {
        allEvenFailed: function() { return mixins.buildPromise([]); }
    };
});
