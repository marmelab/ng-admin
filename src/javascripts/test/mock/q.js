/*global define*/

define('mock/q', [
    'mixins'
], function (mixins) {
    "use strict";

    var $q = {
        when: mixins.buildPromise,
        all: mixins.buildPromise,
        reject: mixins.buildPromise
    };

    return $q;
});
