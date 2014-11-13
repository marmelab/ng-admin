/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        utils = require('ng-admin/lib/utils'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        Field = require('ng-admin/Main/component/service/config/Field');

    var config = {
        name: 'entity',
        label: 'My entity',
        order: null
    };

    /**
     * @param {String} entityName
     *
     * @constructor
     */
    function Entity(entityName) {
        this.views = {};
        this.values = {};
        this.mappedFields = {};
        this.config = angular.copy(config);
        this.config.name = entityName || 'entity';
        this.config.label = utils.camelCase(this.config.name);
        this.identifierField = new Field('id');
    }

    Configurable(Entity.prototype, config);

    /**
     * Returns all views
     *
     * @returns {[View]}
     */
    Entity.prototype.getViews = function () {
        return this.views;
    };

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
     * Returns all views by type
     *
     * @returns {[View]}
     */
    Entity.prototype.getViewsOfType = function (type) {
        var views = [],
            view,
            i;

        for (i in this.views) {
            view = this.views[i];

            if (view.type === type) {
                views.push(view);
            }
        }

        return views;
    };


    /**
     * Returns one view by type
     *
     * @returns {View}
     */
    Entity.prototype.getOneViewOfType = function (type) {
        var views = this.getViewsOfType(type);

        return views.length ? views[0] : null;
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
     * Returns a view by it's name
     *
     * @returns {View}
     */
    Entity.prototype.getView = function (name) {
        return this.views[name];
    };

    /**
     * Add a view
     *
     * @param {View} view
     *
     * @returns {Entity}
     */
    Entity.prototype.addView = function (view) {
        view.setEntity(this);
        this.views[view.name()] = view;

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
