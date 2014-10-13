define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');
    var availableTypes = ['number', 'string', 'text', 'wysiwyg', 'email', 'date', 'callback', 'choice'];
    var availableEditions = ['read-only', 'editable'];

    var defaultValueTransformer = function(value) {
        return value;
    };

    var defaultValueCallback = function(Entity) {
        return '';
    };

    var config = {
        name: 'myField',
        type: 'string',
        label: 'My field',
        edition : 'editable',
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
        choices: []
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

    /**
     * Set of get the type
     *
     * @param {String} type
     * @returns string|Field
     */
    Field.prototype.type = function(type) {
        if (arguments.length === 0) {
            return this.config.type;
        }

        if (availableTypes.indexOf(type) === -1) {
            throw 'Type should be one of : "' + availableTypes.join('", "') + '", "' + type + '" given.';
        }

        this.config.type = type;

        return this;
    };

    /**
     *
     * @param {String} edition
     * @returns string|Field
     */
    Field.prototype.edition = function(edition) {
        if (arguments.length === 0) {
            return this.config.edition;
        }

        if (availableEditions.indexOf(edition) === -1) {
            throw 'Edition should be one of ' + availableEditions.join(', ') + '. ' + edition + 'given.';
        }

        this.config.edition = edition;
        return this;
    };

    Field.prototype.getTruncatedListValue = function(value, dashboard) {
        if (this.config.truncateList) {
            value = this.config.truncateList(value, dashboard);
        }

        return value;
    };

    /**
     * @param {Entity} entity
     */
    Field.prototype.setEntity = function(entity) {
        this.entity = entity;

        return this;
    };

    /**
     * @return {Entity}
     */
    Field.prototype.getEntity = function() {
        return this.entity;
    };

    /**
     * @return {string}
     */
    Field.prototype.getSortName = function() {
        return this.entity.name() + '.' + this.name();
    };

    /**
      * Return field value
      *
      * @returns mixed
      */
    Field.prototype.getCallbackValue = function(data) {
        return this.callback()(data);
    };

    /**
      * Returns value used in list
      *
      * @returns mixed
      */
    Field.prototype.getListValue = function() {
        return this.value;
    };

    Field.prototype.clear = function() {
        this.value = null;

        return this;
    };

    Configurable(Field.prototype, config);

    return Field;
});
