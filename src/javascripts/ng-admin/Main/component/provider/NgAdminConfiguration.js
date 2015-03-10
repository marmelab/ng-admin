/*global define*/

define(function () {
    'use strict';

    function NgAdminConfiguration() {
        this.config = null;
        this.fieldTypes = {};
        this.fieldViews = {};
    }

    NgAdminConfiguration.prototype.configure = function (config) {
        this.config = config;
    };

    NgAdminConfiguration.prototype.$get = function () {
        var config = this.config;
        return function () {
            return config;
        };
    };

    NgAdminConfiguration.$inject = [];

    return NgAdminConfiguration;
});
