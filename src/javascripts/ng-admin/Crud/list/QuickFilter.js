/*global define*/

define(function (require) {
    'use strict';

    var quickFilterView = require('text!./QuickFilter.html'),
        QuickFilterController = require('./QuickFilterController');

    function QuickFilterDirective() {
        return {
            restrict: 'E',
            scope: {
                quickFilters: '='
            },
            template: quickFilterView,
            controllerAs: 'quickFilterCtrl',
            controller: QuickFilterController
        };
    }

    QuickFilterDirective.$inject = [];

    return QuickFilterDirective;
});
