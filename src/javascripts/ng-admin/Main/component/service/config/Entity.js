define(function (require) {
    'use strict';

    var angular = require('angular');
    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var config = {
        name: 'entity',
        label: 'My entity',
        order: null
    };

    /**
     * @param {String} entityName
     *
     * @constructor
     */
    function Entity(entityName) {
        this.views = {};
        this.config = angular.copy(config);
        this.config.name = entityName || 'entity';
    }

    /**
     * Returns all views
     *
     * @returns {Object}
     */
    Entity.prototype.getViews = function() {
        return this.views;
    };

    /**
     * Returns a view by it's name
     *
     * @returns {Field}
     */
    Entity.prototype.getView = function(name) {
        return this.views[name];
    };

    /**
     * Add a view
     *
     * @param {String} name
     * @param {View} view
     *
     * @returns {Entity}
     */
    Entity.prototype.addView = function(name, view) {
        this.views[name] = view;

        return this;
    };

    Configurable(Entity.prototype, config);

    return Entity;
});
