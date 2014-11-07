/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        availableTypes = ['number', 'string', 'text', 'wysiwyg', 'email', 'date', 'boolean', 'choice', 'choices', 'password', 'callback'];

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
        displayed: true,
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
            required: false,
            maxlength: false
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
        this.config = angular.copy(config);
        this.config.name = fieldName || 'field';
        this.entity = null; // Used when this field is an identifier
        this.view = null;
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
     * @param {View} view
     */
    Field.prototype.setView = function (view) {
        this.view = view;

        return this;
    };

    /**
     * @return {View}
     */
    Field.prototype.getView = function () {
        return this.view;
    };

    /**
     * @return {string}
     */
    Field.prototype.getSortName = function () {
        return this.view.name() + '.' + this.name();
    };

    /**
      * Return field value
      *
      * @returns mixed
      */
    Field.prototype.getCallbackValue = function (data) {
        return this.callback()(data);
    };

    /**
     * Return the entity attached to the Field
     * this.entity is set first when this Field is used as an identifier
     *
     * @return {Entity}
     */
    Field.prototype.getEntity = function () {
        if (this.entity === null) {
            this.entity = this.view.getEntity();
        }

        return this.entity;
    };

    return Field;
});
