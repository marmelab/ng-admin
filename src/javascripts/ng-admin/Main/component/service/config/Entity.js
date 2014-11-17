/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        utils = require('ng-admin/lib/utils'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        DashboardView = require('ng-admin/Main/component/service/config/view/DashboardView'),
        ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        CreateView = require('ng-admin/Main/component/service/config/view/CreateView'),
        EditView = require('ng-admin/Main/component/service/config/view/EditView'),
        DeleteView = require('ng-admin/Main/component/service/config/view/DeleteView');

    var config = {
        name: 'entity',
        label: 'My entity',
        order: null,
        dashboardView: new DashboardView(),
        listView: new ListView(),
        createView: new CreateView(),
        editView: new EditView(),
        deleteView: new DeleteView()
    };

    /**
     * @param {String} entityName
     *
     * @constructor
     */
    function Entity(entityName) {
        this.values = {};
        this.mappedFields = {};
        this.config = angular.copy(config);
        this.config.name = entityName || 'entity';
        this.config.label = utils.camelCase(this.config.name);
        this.identifierField = new Field('id');
    }

    Configurable(Entity.prototype, config);

    /**
     * Returns the value of a fieldName
     *
     * @params {String} fieldName
     *
     * @returns {*}
     */
    Entity.prototype.getValue = function (fieldName) {
        return this.values[fieldName] !== undefined ? this.values[fieldName] : null;
    };

    /**
     * Set the value of a fieldName
     *
     * @params {String} fieldName
     * @params {*}      value
     *
     * @returns {Entity}
     */
    Entity.prototype.setValue = function (fieldName, value) {
        this.values[fieldName] = value;

        return this;
    };

    /**
     * Returns one view by type
     *
     * @returns {View}
     */
    Entity.prototype.getViewByType = function (type) {
        switch (type) {
            case 'DashboardView':
                return this.dashboardView;
            case 'ListView':
                return this.listView;
            case 'CreateView':
                return this.createView;
            case 'EditView':
                return this.editView;
            case 'DeleteView':
                return this.deleteView;
            default:
                throw new Error('Unkonwn view type ' + type);
        }
    };

    /**
     * Set or get the identifier
     *
     * @param {Field} identifier
     * @returns Field|Entity
     */
    Entity.prototype.identifier = function (identifier) {
        if (arguments.length === 0) {
            return this.identifierField;
        }

        this.identifierField = identifier;

        return this;
    };

    /**
     * Add extra field to map
     * Useful when we need a field that is not in the Entity view in a template
     *
     * @param {Field} field
     *
     * @returns {Entity}
     */
    Entity.prototype.addMappedField = function (field) {
        this.mappedFields[field.name()] = field;

        return this;
    };

    /**
     * Return all field to map
     *
     * @returns {Object}
     */
    Entity.prototype.getMappedFields = function () {
        return this.mappedFields;
    };

    /**
     * Return the value of a mapped field
     *
     * @param {String} fieldName
     * @returns {*}
     */
    Entity.prototype.getMappedValue = function (fieldName) {
        return this.values[fieldName];
    };

    return Entity;
});
