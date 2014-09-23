define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    return function(fieldName) {
        var availableTypes = ['number', 'string', 'text', 'wysiwyg', 'email', 'date', 'callback'];
        var availableEditions = ['read-only', 'editable'];
        var name = fieldName || 'field';

        var defaultValueTransformer = function(value) {
            return value;
        };

        var defaultValueCallback = function(Entity) {
            return '';
        };

        var config = {
            type: 'string',
            label: 'My field',
            edition : 'editable',
            order: null,
            identifier : false,
            format : 'yyyy-MM-dd',
            valueTransformer : defaultValueTransformer,
            list: true,
            dashboard: true,
            truncateList: false,
            isEditLink: true,
            callback: defaultValueCallback,
            validation: {
                required: false
            }
        };

        /**
         * @constructor
         */
        function Field() {
            this.value = null;
            this.entity = null;
        }

        Configurable(Field, config);

        /**
         * Object.name is protected, use a getter for it
         *
         * @returns {string}
         */
        Field.getName = function() {
            return name;
        };

        /**
         * Return field value
         *
         * @returns mixed
         */
        Field.getCallbackValue = function(data) {
            return this.callback()(data);
        };

        /**
         * Set of get the type
         *
         * @param {String} type
         * @returns string|Field
         */
        Field.type = function(type) {
            if (arguments.length === 0) {
                return config.type;
            }

            if (availableTypes.indexOf(type) === -1) {
                throw 'Type should be one of : "' + availableTypes.join('", "') + '", "' + type + '" given.';
            }

            config.type = type;

            return this;
        };

        /**
         *
         * @param {String} edition
         * @returns string|Field
         */
        Field.edition = function(edition) {
            if (arguments.length === 0) {
                return config.edition;
            }

            if (availableEditions.indexOf(edition) === -1) {
                throw 'Edition should be one of ' + availableEditions.join(', ') + '. ' + edition + 'given.';
            }

            config.edition = edition;
            return this;
        };

        Field.getTruncatedListValue = function(value, dashboard) {
            if (config.truncateList) {
                value = config.truncateList(value, dashboard);
            }

            return value;
        };

        Field.setEntity = function(e) {
            this.entity = e;
        };

        return Field;
    }
});
