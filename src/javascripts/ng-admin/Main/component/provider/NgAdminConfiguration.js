/*global define*/

define(function (require) {
    'use strict';

    var Application = require('ng-admin/Main/component/service/config/Application');
    var Entity = require('ng-admin/Main/component/service/config/Entity');
    var Field = require('ng-admin/Main/component/service/config/Field');

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

    NgAdminConfiguration.prototype.registerFieldView = function(type, FieldView) {
        this.fieldViews[type] = FieldView;
    }

    NgAdminConfiguration.prototype.fieldView = function(type) {
        console.log(type)
        return this.fieldViews[type];
    }

    NgAdminConfiguration.$inject = [];

    return NgAdminConfiguration;
});
