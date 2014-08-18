define(['lib/config/Configurable'], function (Configurable) {
    'use strict';

    return function(entityName) {
        var name = entityName || 'entity';
        var fields = {};

        var config = {
            label: 'My entity',
            dashboard: 5,
            perPage: 30,
            pagination: false
        };

        /**
         *
         * @constructor
         */
        function Entity() {
        }

        /**
         * Object.name is protected, use a getter for it
         *
         * @returns {string}
         */
        Entity.getName = function() {
            return name;
        };

        /**
         * Add an field to the entity
         * @param {Field} field
         */
        Entity.addField = function(field) {
            fields[field.getName()] = field;

            return this;
        };

        /**
         * Returns all fields
         *
         * @returns {Object}
         */
        Entity.getFields = function() {
            return fields;
        };

        Configurable(Entity, config);

        return Entity;
    }
});
