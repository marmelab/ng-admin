/*global define*/

define(function (require) {
    'use strict';

    var Application = require('ng-admin/Main/component/service/config/Application');
    var Entity = require('ng-admin/Main/component/service/config/Entity');
    var Field = require('ng-admin/Main/component/service/config/Field');
    var Reference = require('ng-admin/Main/component/service/config/Reference');
    var ReferenceMany = require('ng-admin/Main/component/service/config/ReferenceMany');
    var ReferencedList = require('ng-admin/Main/component/service/config/ReferencedList');

    function NgAdminConfiguration() {
        this.config = null;
        this.fieldTypes = {};
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

    NgAdminConfiguration.prototype.registerFieldType = function(name, FieldConstructor) {
        this.fieldTypes[name] = FieldConstructor;
    }

    /**
     * @returns {Field}
     */
    NgAdminConfiguration.prototype.field = function(name, type) {
        type = type || 'string';
        if (!this.fieldTypes[type]) {
            throw new Error('Unkown field type "' + type + '"');
        };
        var FieldConstructor = this.fieldTypes[type];
        var field = new FieldConstructor(name);
        field.type(type);
        return field;
    };

    NgAdminConfiguration.$inject = [];

    return NgAdminConfiguration;
});
