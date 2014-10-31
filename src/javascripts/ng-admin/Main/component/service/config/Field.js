/*global define*/

define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');
    var availableTypes = ['number', 'string', 'text', 'boolean', 'wysiwyg', 'email', 'date', 'callback', 'choice', 'password'];
    var availableEditions = ['read-only', 'editable'];

    function defaultValueTransformer(value) {
        return value;
    }

    function defaultValueCallback(entry) {
        return '';
    }

    var config = {
        name: 'myField',
        type: 'string',
        label: 'My field',
        editable : true,
        order: null,
        identifier : false,
        format : 'yyyy-MM-dd',
        valueTransformer : defaultValueTransformer,
        callback: defaultValueCallback,
        isEditLink: true,
        list: true,
        dashboard: true,
        truncateList: false,
        validation: {
            required: false
        },
        choices: [],
        defaultValue: null
    };

    /**
     * @constructor
     *
     * @param {String } fieldName
     *
     */
    function Field(fieldName) {
        this.value = null;
        this.config = angular.copy(config);
        this.config.name = fieldName || 'field';
        this.entity = null;
    }

    Configurable(Field.prototype, config);

    /**
     * Set or get the type
     *
     * @param {String} type
     * @returns string|Field
     */
    Field.prototype.type = function (type) {
        if (arguments.length === 0) {
            return this.config.type;
        }

        if (availableTypes.indexOf(type) === -1) {
            throw new Error('Type should be one of : "' + availableTypes.join('", "') + '" but "' + type + '" was given.');
        }

        this.config.type = type;

        return this;
    };

    /**
     * Truncate the value based on the `truncateList` configuration
     *
     * @param {*} value
     *
     * @returns {*}
     */
    Field.prototype.getTruncatedListValue = function (value) {
        if (this.config.truncateList) {
            value = this.config.truncateList(value);
        }

        return value;
    };

    /**
     * @param {Entity} entity
     */
    Field.prototype.setEntity = function (entity) {
        this.entity = entity;

        return this;
    };

    /**
     * @return {Entity}
     */
    Field.prototype.getEntity = function () {
        return this.entity;
    };

    /**
     * @return {string}
     */
    Field.prototype.getSortName = function () {
        return this.entity.name() + '.' + this.name();
    };

    /**
      * Return field value
      *
      * @returns mixed
      */
    Field.prototype.getCallbackValue = function(entity) {
        return this.callback()(entity);
    };

    /**
      * Returns value used in list
      *
      * @returns mixed
      */
    Field.prototype.getListValue = function () {
        return this.value;
    };

    Field.prototype.clear = function () {
        this.value = null;

        return this;
    };

    Field.prototype.processDefaultValue = function() {
        if (!this.value && this.defaultValue()) {
            this.value = this.defaultValue();
        }
    };

    Configurable(Field.prototype, config);

    return Field;
});
