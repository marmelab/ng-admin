define(function (require) {
    'use strict';

    var angular = require('angular');
    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var defaultSortParams = function (field, dir) {
        return {
            params:{
                _sort: field,
                _sortDir: dir
            },
            headers: {
            }
        };
    };

    var defaultFilterParams = function(params) {
        return params;
    };

    var config = {
        name: 'entity',
        label: 'My entity',
        order: null,
        filterParams: defaultFilterParams,
        sortParams: defaultSortParams
    };

    /**
     * @param {String} entityName
     *
     * @constructor
     */
    function Entity(entityName) {
        this.views = {};
        this.config = angular.copy(config);
        this.config.name = entityName || 'entity';
    }

    /**
     * Returns all views
     *
     * @returns {Object}
     */
    Entity.prototype.getViews = function() {
        return this.views;
    };

    /**
     * Returns all views
     *
     * @returns {Object}
     */
    Entity.prototype.getViewsOfType = function(type) {
        var views = [];

        angular.forEach(this.views, function(view) {
            if (view.constructor.name === type) {
                views.push(view);
            }
        });

        return views;
    };

    /**
     * Returns a view by it's name
     *
     * @returns {Field}
     */
    Entity.prototype.getView = function(name) {
        return this.views[name];
    };

    /**
     * Add a view
     *
     * @param {View} view
     *
     * @returns {Entity}
     */
    Entity.prototype.addView = function(view) {
        view.setEntity(this);
        this.views[view.name()] = view;

        return this;
    };

    /**
     * Return the identifier field of an Entity
     *
     * @returns {Field}
     */
    Entity.prototype.getIdentifier = function() {
        var editView = this.getViewsOfType('EditView')[0];

        return editView ? editView.getIdentifier() : null;
    };

    /**
     * Return configurable sorting params
     *
     * @returns {Object}
     */
    Entity.prototype.getSortParams = function(sortField, sortDir) {
        return typeof (this.config.sortParams) === 'function' ? this.config.sortParams(sortField, sortDir) : this.config.sortParams;
    };

    Configurable(Entity.prototype, config);

    return Entity;
});
