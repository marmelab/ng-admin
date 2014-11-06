define(function(require) {
    'use strict';

    var angular = require('angular'),
        menuView = require('text!../../view/menu.html');

    function Menu() {
        return {
            restrict: 'E',
            template: menuView
        };
    }

    Menu.$inject = [];

    return Menu;
});
