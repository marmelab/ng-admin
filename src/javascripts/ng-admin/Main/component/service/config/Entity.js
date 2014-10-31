/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable');

    function defaultSortParams(field, dir) {
        return {
            params: {
                _sort: field,
                _sortDir: dir
            },
            headers: {
            }
        };
    }

    function defaultFilterParams(params) {
        return params;
    }

    var config = {
        name: 'entity',
        label: 'My entity',
        identifier: null,
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

            if (view.constructor.name === type) {
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
     * Return the identifier field of an Entity
     *
     * @returns {Field}
     */
    Entity.prototype.getIdentifier = function () {
        var editView = this.getViewsOfType('EditView')[0];

        return editView ? editView.getIdentifier() : null;
    };

    /**
     * Return configurable sorting params
     *
     * @returns {Object}
     */
    Entity.prototype.getSortParams = function (sortField, sortDir) {
        return typeof (this.config.sortParams) === 'function' ? this.config.sortParams(sortField, sortDir) : this.config.sortParams;
    };

    return Entity;
});
