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
     * Returns all views
     *
     * @returns {Object}
     */
    Entity.prototype.getViewsOfType = function(type) {
        var views = [];

        angular.forEach(this.views, function(view) {
            if (view.constructor.name === type) {
                views.push(view);
            }
        });

        return views;
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
     * @param {View} view
     *
     * @returns {Entity}
     */
    Entity.prototype.addView = function(view) {
        view.setEntity(this);
        this.views[view.name()] = view;

        return this;
    };

    Configurable(Entity.prototype, config);

    return Entity;
});
