define(['lib/config/Configurable'], function (Configurable) {
    'use strict';

    var defaultPaginationLink = function(page, maxPerPage) {
        return {
            page: page,
            per_page: maxPerPage
        };
    };

    var defaultTotalItems = function(response) {
        return response.headers('X-Count');
    };

    return function(entityName) {
        var name = entityName || 'entity';
        var fields = {};

        var config = {
            label: 'My entity',
            dashboard: 5,
            perPage: 30,
            pagination: defaultPaginationLink,
            infinitePagination: false,
            totalItems: defaultTotalItems,
            extraParams: null,
            interceptor: null
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
            if (field.order() === null) {
                field.order(Object.keys(fields).length);
            }

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
            var references = this.getFieldsOfType('Reference');
            var referencesMany = this.getFieldsOfType('ReferenceMany');

            angular.forEach(referencesMany, function(ref, key) {
                references[key] = ref;
            });

            return references;
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

        Entity.getExtraParams = function() {
            var params = {};
            if (config.extraParams) {
                params = typeof (config.extraParams) === 'function' ? config.extraParams() : config.extraParams;
            }

            return params;
        };

        Configurable(Entity, config);

        return Entity;
    }
});
