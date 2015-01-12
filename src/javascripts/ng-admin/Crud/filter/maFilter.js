/*global define*/

define(function (require) {
    'use strict';

    var filterView = require('text!./maFilter.html'),
        FilterController = require('./maFilterController');

    function maFilterDirective() {
        return {
            restrict: 'E',
            template: filterView,
            scope: {
                filters: '&'
            },
            controllerAs: 'filterCtrl',
            controller: FilterController
        };
    }

    maFilterDirective.$inject = [];

    return maFilterDirective;
});
