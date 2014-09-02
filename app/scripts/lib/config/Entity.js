define(['lib/config/Configurable'], function (Configurable) {
    'use strict';

    var defaultPaginationLink = function(page, maxPerPage) {
        return {
            page: page,
            per_page: maxPerPage
        };
    };

    return function(entityName) {
        var name = entityName || 'entity';
        var fields = {};

        var config = {
            label: 'My entity',
            dashboard: 5,
            perPage: 30,
            pagination: defaultPaginationLink,
            infinitePagination: false
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

        Entity.getIdentifier = function() {
            for(var i in fields) {
                if (!fields.hasOwnProperty(i)){
                    continue;
                }

                var field = fields[i];
                if (field.identifier()) {
                    return field;
                }
            }
        };

        /**
         * Returns all references
         *
         * @returns {Object}
         */
        Entity.getReferences = function() {
            return this.getFieldsOfType('Referenced')
        };


        /**
         * Returns all referenced lists
         *
         * @returns {Object}
         */
        Entity.getReferencedLists = function() {
            return this.getFieldsOfType('ReferencedList')
        };

        /**
         * Returns fields by type
         *
         * @param {String }type
         * @returns {Array}
         */
        Entity.getFieldsOfType = function(type) {
            var results = {};

            for(var i in fields) {
                if (!fields.hasOwnProperty(i)) {
                    continue;
                }

                var field = fields[i];
                if (field.name === type) {
                    results[i] = field;
                }
            }

            return results;
        };

        Configurable(Entity, config);

        return Entity;
    }
});
