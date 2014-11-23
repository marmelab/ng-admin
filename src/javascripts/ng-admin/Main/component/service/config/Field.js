/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        utils = require('ng-admin/lib/utils'),
        availableTypes = ['number', 'string', 'text', 'wysiwyg', 'email', 'date', 'boolean', 'choice', 'choices', 'password', 'template'];

    function defaultValueTemplate(entry) {
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
        template: defaultValueTemplate,
        isEditLink: false,
        list: true,
        dashboard: true,
        validation: {
            required: false,
            minlength: 0,
            maxlength: 99999 // We can't remove ng-maxlength directive
        },
        choices: [],
        defaultValue: null,
        cssClasses: []
    };

    /**
     * @constructor
     *
     * @param {String } fieldName
     *
     */
    function Field(fieldName) {
        this.config = angular.copy(config);
        this.config.name = fieldName || Math.random().toString(36).substring(7);
        this.config.label = utils.camelCase(this.config.name);
        this.config.isEditLink = fieldName === 'id';
        this.entity = null; // Used when this field is an identifier
        this.view = null;
        this.maps = [];
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
     * Add a map function
     *
     * @param {Function} fn
     *
     * @returns {Field}
     */
    Field.prototype.map = function (fn) {
        this.maps.push(fn);

        return this;
    };

    Field.prototype.validation = function(obj) {
        if (!arguments.length) {
            // getter
            return this.config.validation;
        }
        // setter
        for (var property in obj) {
            if (!obj.hasOwnProperty(property)) continue;
            if (obj[property] === null) {
                delete this.config.validation[property];
            } else {
                this.config.validation[property] = obj[property];
            }
        }
        return this;
    }

    /**
     * Truncate the value based after applying all maps
     *
     * @param {*} value
     *
     * @returns {*}
     */
    Field.prototype.getMappedValue = function (value, entry) {
        for (var i in this.maps) {
            value = this.maps[i](value, entry);
        }

        return value;
    };

    /**
     * Get CSS classes list based on the `cssClasses` configuration
     *
     * @returns {string}
     */
    Field.prototype.getCssClasses = function () {
        var classes = 'form-control';

        if (this.config.cssClasses) {
            classes += ' ' + this.config.cssClasses.join(' ');
        }

        return classes;
    }

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
    Field.prototype.getTemplateValue = function (data) {
        return typeof (this.config.template) === 'function' ? this.config.template(data) : this.config.template;
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
