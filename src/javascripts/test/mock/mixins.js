/*global define*/

define('mixins', [], function () {
    "use strict";

    var buildPromise = function (output) {
        return (function () {
            var result;
            return {
                'then': function (cb) {
                    result = cb(output);

                    if (result && result.then) {
                        // The result is already a promise, just return it
                        return result;
                    }

                    // We chain the result into a new promise
                    return buildPromise(result);
                },
                'finally': function (cb) {
                    cb();
                    return this;
                }
            };
        }());
    };

    return {
        buildPromise: buildPromise
    };
});
