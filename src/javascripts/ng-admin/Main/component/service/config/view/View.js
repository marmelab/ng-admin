define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var fieldTypes = {
        Field: require('ng-admin/Main/component/service/config/Field'),
        Reference: require('ng-admin/Main/component/service/config/Reference'),
        ReferencedList: require('ng-admin/Main/component/service/config/ReferencedList'),
        ReferenceMany: require('ng-admin/Main/component/service/config/ReferenceMany')
    };

    /**
     * Return the title depending if the config is a string or a function
     *
     * @param {Function} config
     * @param {Entity} entity
     * @returns {String}
     */
    function getTitle(config, entity) {
        var title = config;
        if (typeof (title) === 'function') {
            title = title(entity);
        }

        return title;
    }

    var defaultTitle = function(action, entity) {
        return action + ' ' + entity.label();
    };

    var defaultDescription = function (entity) {
        return null;
    };

    var config = {
        name: 'myDashboard',
        label: 'My reference',
        order: null,
        title: defaultTitle,
        description: defaultDescription,
        extraParams: null,
        interceptor: null
    };

    /**
     * @constructor
     */
    function View() {
        this.fields = [];
        this.actions = [];
        this.entity = null;
    }

    /***
     * @param {Entity} entity
     */
    View.prototype.setEntity = function(entity) {
        this.entity = entity;

        return this;
    };

    /**
     * @param {Field} field
     */
    View.prototype.addField = function(field) {
        if (field.order() === null) {
            field.order(Object.keys(this.fields).length);
        }

        field.setEntity(this);
        this.fields[field.name()] = field;

        return this;
    };

    /**
     * @param {Action} action
     */
    View.prototype.addAction = function(action) {
        if (action.order() === null) {
            action.order(Object.keys(this.actions).length);
        }

        this.actions[action.name()] = action;

        return this;
    };


    View.prototype.getDescription = function() {
        return getTitle(this.config.description, this);
    };

    /**
     * Returns all references
     *
     * @returns {Object}
     */
    View.prototype.getReferences = function() {
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
    View.prototype.getReferencedLists = function() {
        return this.getFieldsOfType('ReferencedList')
    };

    /**
     * Returns fields by type
     *
     * @param {String }type
     * @returns {Array}
     */
    View.prototype.getFieldsOfType = function(type) {
        var results = {};

        for(var i in this.fields) {
            if (!this.fields.hasOwnProperty(i)) {
                continue;
            }

            var field = this.fields[i];
            if (field instanceof fieldTypes[type]) {
                results[i] = field;
            }
        }

        return results;
    };

    /**
     * Return configurable extra params
     *
     * @returns {Object}
     */
    View.prototype.getExtraParams = function() {
        var params = {};
        if (this.config.extraParams) {
            params = typeof (this.config.extraParams) === 'function' ? this.config.extraParams() : this.config.extraParams;
        }

        return params;
    };

    /**
     * Return the identifier field
     *
     * @returns {Field}
     */
    View.prototype.getIdentifier = function() {
        for(var i in this.fields) {
            if (!this.fields.hasOwnProperty(i)){
                continue;
            }

            var field = this.fields[i];
            if (field.identifier()) {
                return field;
            }
        }
    };

    /**
     * Returns true is the Entity wasn't populated
     *
     * @returns {boolean}
     */
    View.prototype.isNew = function() {
        var identifier = this.getIdentifier();
        return !identifier || identifier.value === null;
    };

    /**
     * Clear all fields
     */
    View.prototype.clear = function() {
        angular.forEach(this.getFields(), function(field){
            field.clear();
        });
    };

    Configurable(View.prototype, config);

    return View;
});
