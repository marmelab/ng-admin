define([], function() {
    'use strict';

    function Configuration() {
        this.config = null;
    }

    Configuration.prototype.configure = function(config) {
        this.config = config;
    };

    Configuration.prototype.$get = function() {
        var self = this;

        return function() {
            return self.config;
        }
    };

    Configuration.$inject = [];

    return Configuration;
});
