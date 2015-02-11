/*global define*/

define(function () {
    'use strict';

    var Entity = require('ng-admin/Main/component/service/config/Entity');
    var Field = require('ng-admin/Main/component/service/config/Field');

    function NgAdminConfiguration() {
        this.config = null;
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
     * @returns {Entity}
     */
    NgAdminConfiguration.prototype.entity = function(name) {
        return new Entity(name);
    };

    /**
     * @returns {Field}
     */
    NgAdminConfiguration.prototype.field = function(name, type) {
        var field = new Field(name);
        if (type) {
            field.type(type);
        }
        return field;
    };

    NgAdminConfiguration.$inject = [];

    return NgAdminConfiguration;
});
