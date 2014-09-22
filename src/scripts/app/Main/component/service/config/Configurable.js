// @see: https://github.com/marmelab/gremlins.js/blob/master/src/utils/configurable.js

define(function () {
    "use strict";

    function configurable(targetFunction, config) {
        for (var item in config) {
            (function(item) {
                targetFunction[item] = function(value) {
                    if (!arguments.length) return config[item];
                    config[item] = value;

                    return targetFunction;
                };
            })(item); // for doesn't create a closure, forcing it
        }
    }

    return configurable;
});
