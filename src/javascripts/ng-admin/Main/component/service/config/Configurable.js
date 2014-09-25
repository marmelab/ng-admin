// @see: https://github.com/marmelab/gremlins.js/blob/master/src/utils/configurable.js

define(function () {
    "use strict";

    function configurable(target, config) {
        for (var propertyName in config) {
            (function(propertyName) {
                target[propertyName] = function(value) {
                    if (!arguments.length) return this.config[propertyName];

                    this.config[propertyName] = value;

                    return this;
                };
            })(propertyName); // for doesn't create a closure, forcing it
        }
    }

    return configurable;
});
