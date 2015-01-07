/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        utils = require('ng-admin/lib/utils'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        DashboardView = require('ng-admin/Main/component/service/config/view/DashboardView'),
        MenuView = require('ng-admin/Main/component/service/config/view/MenuView'),
        FilterView = require('ng-admin/Main/component/service/config/view/FilterView'),
        ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        ShowView = require('ng-admin/Main/component/service/config/view/ShowView'),
        CreateView = require('ng-admin/Main/component/service/config/view/CreateView'),
        EditView = require('ng-admin/Main/component/service/config/view/EditView'),
        DeleteView = require('ng-admin/Main/component/service/config/view/DeleteView');

    var config = {
        name: 'entity',
        label: 'My entity',
        order: null,
        baseApiUrl: null,
        identifier: null,
        url: null,
        dashboardView: null,
        filterView: null,
        menuView: null,
        listView: null,
        showView: null,
        creationView: null,
        editionView: null,
        deletionView: null
    };

    /**
     * @param {String} entityName
     *
     * @constructor
     */
    function Entity(entityName) {
        this.values = {};
        this.config = angular.copy(config);
        this.config.name = entityName || 'entity';
        this.config.label = utils.camelCase(this.config.name);
        this.config.identifier = new Field('id');
        this.isReadOnly = false;
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

    /**
     * @param {View} view
     * @param {*} entityId
     *
     * @return String
     */
    Entity.prototype.getUrl = function (view, entityId) {
        return typeof (this.config.url) === 'function' ? this.config.url(view, entityId) : this.config.url;
    };

    Entity.prototype.initViews = function () {
        this.config.dashboardView = new DashboardView().setEntity(this);
        this.config.menuView = new MenuView();
        this.config.filterView = new FilterView();
        this.config.listView = new ListView().setEntity(this);
        this.config.showView = new ShowView().setEntity(this);
        this.config.creationView = new CreateView().setEntity(this);
        this.config.editionView = new EditView().setEntity(this);
        this.config.deletionView = new DeleteView().setEntity(this);
    };

    function getPropertyNameBasedOnViewType(viewType) {
        switch (viewType) {
            case 'DashboardView':
                return 'dashboardView';
            case 'ListView':
                return 'listView';
            case 'FilterView':
                return 'filterView';
            case 'ShowView':
                return 'showView';
            case 'CreateView':
                return 'creationView';
            case 'EditView':
                return 'editionView';
            case 'DeleteView':
                return 'deletionView';
            default:
                throw new Error('Unknown view type ' + viewType);
        }
    }

    /**
     * Return one of the internal views
     *
     * Uses accessors added by Configurable on the view properties.
     *
     * @returns {View}
     */
    Entity.prototype.getViewByType = function getViewByType(type) {
        return this[getPropertyNameBasedOnViewType(type)]();
    };

    /**
     * Add (set) a view to the entity
     *
     * @deprecated access the view getter instead (e.g. `listView()`)
     */
    Entity.prototype.addView = function addView(view) {
        var viewType = view.type,
            propertyName = getPropertyNameBasedOnViewType(viewType);

        view.setEntity(this);
        this[propertyName](view);
        console.warn('addView() is deprecated. Views are added by default, use ' + propertyName + '() instead to retrieve the view and customize it');

        return this;
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

    Entity.prototype.readOnly = function () {
        this.isReadOnly = true;
        this.config.creationView.disable();
        this.config.editionView.disable();
        this.config.deletionView.disable();
        return this;
    };

    /**
     * @deprecated not necessary anymore
     */
    Entity.prototype.addMappedField = function () {
        console.warn('Entity.addMappedField() is deprecated and not useful anymore');
        return this;
    };

    return Entity;
});
