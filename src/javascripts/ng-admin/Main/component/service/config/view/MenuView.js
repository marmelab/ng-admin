/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var config = {
        title: null,
        order: null,
        icon: '<span class="glyphicon glyphicon-list"></span>'
    };

    /**
     * @constructor
     */
    function MenuView() {
        this.enabled = true;
        this.config = angular.copy(config);
        this.type = 'MenuView';
    }

    MenuView.prototype.isEnabled = function() {
        return this.enabled;
    }

    MenuView.prototype.disable = function() {
        this.enabled = false;
        return this;
    }

    Configurable(MenuView.prototype, config);

    return MenuView;
});
