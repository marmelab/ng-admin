/*global define*/

define(function () {
    'use strict';

    var Application = require('ng-admin/Main/component/service/config/Application');
    var Entity = require('ng-admin/Main/component/service/config/Entity');
    var Field = require('ng-admin/Main/component/service/config/Field');
    var Reference = require('ng-admin/Main/component/service/config/Reference');
    var ReferenceMany = require('ng-admin/Main/component/service/config/ReferenceMany');
    var ReferencedList = require('ng-admin/Main/component/service/config/ReferencedList');

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
     * @returns {Application}
     */
    NgAdminConfiguration.prototype.application = function(name) {
        return new Application(name);
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
        if (type == 'reference') {
            return new Reference(name);
        }
        if (type == 'reference_many') {
            return new ReferenceMany(name);
        }
        if (type == 'referenced_list') {
            return new ReferencedList(name);
        }
        var field = new Field(name);
        if (type) {
            field.type(type);
        }
        return field;
    };

    NgAdminConfiguration.$inject = [];

    return NgAdminConfiguration;
});
