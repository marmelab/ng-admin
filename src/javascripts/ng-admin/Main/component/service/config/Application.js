define(function (require) {
    "use strict";

    function defaultHeaders() {
        return {};
    }

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var config = {
        title: "Angular admin",
        baseApiUrl: "http://localhost:3000/",
        headers: defaultHeaders
    };

    function Application() {
        this.entities = {};
        this.config = angular.copy(config);
    }

    /**
     * Add an entity to the configuration
     * @param {Entity} entity
     */
    Application.prototype.addEntity = function(entity) {
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
    Application.prototype.hasEntity = function(name) {
        return name in this.entities;
    };

    /**
     * Returns an Entity by it's name
     *
     * @param {String} name
     * @returns {Entity}
     */
    Application.prototype.getEntity = function(name) {
        return this.entities[name];
    };

    /**
     * Returns all entities
     *
     * @returns {Object}
     */
    Application.prototype.getEntities = function() {
        return this.entities;
    };

    /**
     * Returns all entity names
     *
     * @returns {Array}
     */
    Application.prototype.getEntityNames = function() {
        return Object.keys(this.entities);
    };

    Application.prototype.getHeaders = function(entityName, action) {
        return typeof(config.headers) === 'function' ? config.headers(entityName, action) : config.headers;
    };

    Configurable(Application.prototype, config);

    return Application;
});
