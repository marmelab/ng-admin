define(['app/Main/component/service/config/Configurable'], function (Configurable) {
    "use strict";

    function defaultHeaders() {
        return {};
    }

    return function(title) {
        var entities = {};

        var config = {
            title: title || "Angular admin",
            baseApiUrl: "http://localhost:3000/",
            headers: defaultHeaders
        };

        function Application() {
        }

        /**
         * Add an entity to the configuration
         * @param {Entity} entity
         */
        Application.addEntity = function(entity) {
            if (entity.order() === null) {
                entity.order(Object.keys(entities).length);
            }

            entities[entity.getName()] = entity;

            return this;
        };

        /**
         * Returns true if the application has the entity
         * @param {String} name
         * @returns {boolean}
         */
        Application.hasEntity = function(name) {
            return name in entities;
        };

        /**
         * Returns an Entity by it's name
         *
         * @param {String} name
         * @returns {Entity}
         */
        Application.getEntity = function(name) {
            return entities[name];
        };

        /**
         * Returns all entities
         *
         * @returns {Object}
         */
        Application.getEntities = function() {
            return entities;
        };

        /**
         * Returns all entity names
         *
         * @returns {Array}
         */
        Application.getEntityNames = function() {
            return Object.keys(entities);
        };

        Application.getHeaders = function(entityName, action) {
            return typeof(config.headers) === 'function' ? config.headers(entityName, action) : config.headers;
        };

        Configurable(Application, config);

        return Application;
    };
});
