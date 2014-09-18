define(['app/Main/component/service/config/Configurable'], function (Configurable) {
    'use strict';

    return function(fieldName) {
        var availableTypes = ['number', 'text', 'email', 'date'];
        var availableEditions = ['read-only', 'editable'];
        var name = fieldName || 'reference';
        var value = null;
        var choices = {};

        var defaultValueTransformer = function(value) {
            return value;
        };

        var config = {
            type: 'reference',
            label: 'My reference',
            edition : 'editable',
            order: null,
            targetEntity : null,
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
        function Reference() {
        }

        Configurable(Reference, config);

        /**
         * Object.name is protected, use a getter for it
         *
         * @returns {string}
         */
        Reference.getName = function() {
            return name;
        };

        /**
         *
         * @param {String} edition
         * @returns string|Reference
         */
        Reference.edition = function(edition) {
            if (arguments.length === 0) {
                return config.edition;
            }

            if (availableEditions.indexOf(edition) === -1) {
                throw new Exception('Type should be one of ' + availableTypes.join(', '));
            }

            config.edition = edition;
            return this;
        };

        Reference.getChoices = function() {
            return choices;
        };

        Reference.setChoices = function(c) {
            choices = c;

            return this;
        };

        return Reference;
    }
});
