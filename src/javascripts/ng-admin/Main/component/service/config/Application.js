/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable');

    function defaultCustomTemplate(viewName) {
    }

    function defaultErrorMessage(response) {
        var body = response.data;

        if (typeof body === 'object') {
            body = JSON.stringify(body);
        }

        return 'Oops, an error occured : (code: ' + response.status + ') ' + body;
    }

    var config = {
        title: "Angular admin",
        baseApiUrl: "http://localhost:3000/",
        customTemplate: defaultCustomTemplate,
        errorMessage: defaultErrorMessage,
        layout: null,
        menuViews: []
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

    Application.prototype.addMenuView = function (menuView) {
        this.config.menuViews.push(menuView);
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
     * @param {Object} response
     *
     * @returns {Object}
     */
    Application.prototype.getErrorMessageFor = function (view, response) {
        var entity = view.getEntity(),
            errorMessage;

        // Get view's error message
        errorMessage = view.getErrorMessage(response);

        // Get entity's error message
        if (!errorMessage) {
            errorMessage = entity.getErrorMessage(response);
        }

        // Get global error message
        if (!errorMessage) {
            errorMessage = this.getErrorMessage(response);
        }

        return errorMessage;
    };

    /**
     * Return the error message defined for the application
     *
     * @param {Object} response
     *
     * @returns {String}
     */
    Application.prototype.getErrorMessage = function (response) {
        return typeof (this.config.errorMessage) === 'function' ? this.config.errorMessage(response) : this.config.errorMessage;
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
