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
        dashboardView: null,
        listView: null,
        createView: null,
        editView: null,
        deleteView: null
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
        this.initViews();
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

    Entity.prototype.initViews = function() {
        this.config.dashboardView = new DashboardView().setEntity(this);
        this.config.listView = new ListView().setEntity(this);
        this.config.createView = new CreateView().setEntity(this);
        this.config.editView = new EditView().setEntity(this);
        this.config.deleteView = new DeleteView().setEntity(this);
    };

    /**
     * Returns one view by type
     *
     * @returns {View}
     */
    Entity.prototype.getViewByType = function getViewByType(type) {
        switch (type) {
            case 'DashboardView':
                return this.dashboardView();
            case 'ListView':
                return this.listView();
            case 'CreateView':
                return this.createView();
            case 'EditView':
                return this.editView();
            case 'DeleteView':
                return this.deleteView();
            default:
                throw new Error('Unkonwn view type ' + type);
        }
    };

    /**
     * Add (set) a view top the entity
     *
     * @deprecated access the view getter instead (e.g. `listView()`)
     */
    Entity.prototype.addView = function addView(view) {
        var supportedViewConstructors = ['DashboardView', 'ListView', 'CreateView', 'EditView', 'DeleteView'];
        var viewName = view.constructor.name;
        if (supportedViewConstructors.indexOf(viewName) == -1) {
            throw new Error('Unkonwn view type ' + type);
        }
        var viewName = viewName.charAt(0).toLowerCase() + viewName.slice(1);
        view.setEntity(this);
        this[viewName](view);
        console.log('addView() is deprecated. Views are added by default, use ' + viewName + '() instead to retreive the view and customize it');
        return this;
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
