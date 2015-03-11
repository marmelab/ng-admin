/*global define*/

define(function () {
    'use strict';

    function NgAdminConfiguration() {
        this.config = null;
        this.adminDescription = null;
    }

    NgAdminConfiguration.prototype.setAdminDescription = function(adminDescription) {
        this.adminDescription = adminDescription;
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

    /**
     * @deprecated Use AdminDescription.application instead
     */
    NgAdminConfiguration.prototype.application = function(name) {
        return this.adminDescription.application(name);
    };

    /**
     * @deprecated Use AdminDescription.entity instead
     */
    NgAdminConfiguration.prototype.entity = function(name) {
        return this.adminDescription.entity(name);
    };

    /**
     * @deprecated Use AdminDescription.field instead
     */
    NgAdminConfiguration.prototype.field = function(name, type) {
        return this.adminDescription.field(name, type);
    };

    /**
     * @deprecated Use AdminDescription.registerFieldType instead
     */
    NgAdminConfiguration.prototype.registerFieldType = function(name, type) {
        return this.adminDescription.registerFieldType(name, type);
    };

    NgAdminConfiguration.$inject = [];

    return NgAdminConfiguration;
});
