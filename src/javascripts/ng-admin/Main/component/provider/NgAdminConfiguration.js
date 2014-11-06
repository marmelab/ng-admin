define(function() {
    'use strict';

    function NgAdminConfiguration() {
        this.config = null;
    }

    NgAdminConfiguration.prototype.configure = function(config) {
        this.config = config;
    };

    NgAdminConfiguration.prototype.$get = function() {
        var self = this;

        return function() {
            return self.config;
        }
    };

    NgAdminConfiguration.$inject = [];

    return NgAdminConfiguration;
});
