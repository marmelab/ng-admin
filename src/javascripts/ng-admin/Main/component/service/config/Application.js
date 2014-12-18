/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable');

    function defaultTransformParams(params) {
        return params;
    }

    var config = {
        title: "Angular admin",
        baseApiUrl: "http://localhost:3000/",
        transformParams: defaultTransformParams
    };

    function Application(title) {
        this.entities = {};
        this.config = angular.copy(config);
        this.config.title = title || this.config.title;
    }

    /**
     * Add an entity to the configuration
     * @param {Entity} entity
     */
    Application.prototype.addEntity = function (entity) {
        if (entity.order() === null) {
            entity.order(Object.keys(this.entities).length);
        }

        this.entities[entity.name()] = entity;

        return this;
    };

    /**
     * Returns true if the application has the entity
     * @param {String} name
     * @returns {boolean}
     */
    Application.prototype.hasEntity = function (name) {
        return name in this.entities;
    };

    /**
     * Returns an Entity by it's name
     *
     * @param {String} name
     * @returns {Entity}
     */
    Application.prototype.getEntity = function (name) {
        return this.entities[name];
    };

    /**
     * Returns all entities
     *
     * @returns {[Entity]}
     */
    Application.prototype.getEntities = function () {
        return this.entities;
    };

    /**
     * Returns all entity names
     *
     * @returns {Array}
     */
    Application.prototype.getEntityNames = function () {
        return Object.keys(this.entities);
    };

    /**
     * Returns all entities
     *
     * @returns {[View]}
     */
    Application.prototype.getViewsOfType = function (type) {
        var views = [], i;

        for (i in this.entities) {
            views.push(this.entities[i].getViewByType(type));
        }

        return views;
    };

    /**
     * Return the route to call for a view
     *
     * @param {View} view
     * @param {*} entityId
     *
     * @return String
     */
    Application.prototype.getRouteFor = function (view, entityId) {
        var entity = view.getEntity(),
            baseApiUrl = entity.baseApiUrl() || this.baseApiUrl(),
            url = view.getUrl(entityId) || entity.getUrl(view, entityId);

        // If the view or the entity don't define the url, retrieve it from the baseURL of the entity or the app
        if (!url) {
            url = baseApiUrl + entity.name();
            if (entityId) {
                url += '/' + entityId;
            }
        }

        // Add baseUrl for relative URL
        if (!/^(?:[a-z]+:)?\/\//.test(url)) {
            url = baseApiUrl + url;
        }

        return url;
    };

    /**
     * Allows to change query params for a view
     *
     * @param {View} view
     * @param {Object} params
     * @returns {Object}
     */
    Application.prototype.getQueryParamsFor = function (view, params) {
        var entity = view.getEntity();

        if (typeof params === 'undefined') {
            params = {};
        }

        var oldParams = angular.copy(params);

        params = this.getQueryParams(params, oldParams);
        params = entity.getQueryParams(params, oldParams);
        params = view.getQueryParams(params, oldParams);

        return params;
    };

    Application.prototype.getQueryParams = function (params, oldParams) {
        return typeof (this.config.transformParams) === 'function' ? this.config.transformParams(params, oldParams) : this.config.transformParams;
    };

    /**
     * Return one view of a type for an entity
     *
     * @param {String} entityName
     * @param {String} type
     *
     * @return {View}
     */
    Application.prototype.getViewByEntityAndType = function (entityName, type) {
        var entity = this.getEntity(entityName);

        return entity.getViewByType(type);
    };

    Configurable(Application.prototype, config);

    return Application;
});
