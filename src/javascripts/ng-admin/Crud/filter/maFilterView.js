/*global define*/

define(function (require) {
    'use strict';

    var datagridView = require('text!./FilterView.html'),
        FilterViewController = require('./FilterViewController');

    function maFilterViewDirective() {
        return {
            restrict: 'E',
            template: datagridView,
            scope: {
                name: '@',
                fields: '@'
            },
            controllerAs: 'filterViewCtrl',
            controller: FilterViewController
        };
    }

    maFilterViewDirective.$inject = [];

    return maFilterViewDirective;
});
