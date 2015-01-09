/*global define*/

define(function () {
    'use strict';

    function Enabled() {
        return function (input) {
            var results = [],
                objectKey;

            for (objectKey in input) {
                if (input[objectKey].isEnabled()) {
                    results.push(input[objectKey]);
                }
            }

            return results;
        };
    }

    Enabled.$inject = [];

    return Enabled;
});
