/*global jasmine,define*/

define('mock/Restangular', [
    'mixins'
], function (mixins) {
    "use strict";

    var Restangular = {
        one:        function() { return this; },
        oneUrl:     function() { return this; },
        all:        function() { return this; },
        allUrl:     function() { return this; },
        setBaseUrl: function() { return this; },
        setFullResponse: function() { return this; },
        restangularizeElement: function() { return this; },
        get:        function() { return mixins.buildPromise({}); },
        getList:    function() { return mixins.buildPromise({}); },
        customPOST: function() { return mixins.buildPromise({}); },
        customPUT:  function() { return mixins.buildPromise({}); },
        customDELETE: function() { return mixins.buildPromise({}); },
    };

    return Restangular;
});
