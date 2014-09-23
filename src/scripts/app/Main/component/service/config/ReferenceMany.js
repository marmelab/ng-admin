define(function (require) {
    'use strict';

    var Configurable = require('app/Main/component/service/config/Configurable');

    return function(fieldName) {
        var availableTypes = ['number', 'text', 'email', 'date'];
        var availableEditions = ['read-only', 'editable'];
        var name = fieldName || 'reference-many';
        var values = null;
        var choices = {};

        var defaultValueTransformer = function(value) {
            return (typeof value == 'object' && typeof value.length == 'number') ? value : [value];
        };

        var config = {
            type: 'reference-many',
            label: 'My references',
            edition : 'editable',
            order: null,
            targetEntity : null,
            targetField : null,
            targetLabel : null,
            valueTransformer : defaultValueTransformer,
            list: true,
            dashboard: true,
            identifier: false,
            validation: {
                required: false
            }
        };

        /**
         * @constructor
         */
        function ReferenceMany() {
        }

        Configurable(ReferenceMany, config);

        /**
         * Object.name is protected, use a getter for it
         *
         * @returns {string}
         */
        ReferenceMany.getName = function() {
            return name;
        };

        /**
         *
         * @param {String} edition
         * @returns string|Reference
         */
        ReferenceMany.edition = function(edition) {
            if (arguments.length === 0) {
                return config.edition;
            }

            if (availableEditions.indexOf(edition) === -1) {
                throw new Exception('Type should be one of ' + availableTypes.join(', '));
            }

            config.edition = edition;
            return this;
        };

        ReferenceMany.getChoices = function() {
            return choices;
        };

        ReferenceMany.setChoices = function(c) {
            choices = c;

            return this;
        };

        return ReferenceMany;
    }
});
