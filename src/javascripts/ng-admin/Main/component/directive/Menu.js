/*global define*/

define(function (require) {
    'use strict';

    var menuView = require('text!../../view/menu.html');

    function Menu() {
        return {
            restrict: 'E',
            template: menuView
        };
    }

    Menu.$inject = [];

    return Menu;
});
