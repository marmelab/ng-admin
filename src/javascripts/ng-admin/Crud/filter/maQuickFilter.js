/*global define*/

define(function (require) {
    'use strict';

    var quickFilterView = require('text!./QuickFilter.html'),
        QuickFilterController = require('./QuickFilterController');

    function maQuickFilterDirective() {
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

    maQuickFilterDirective.$inject = [];

    return maQuickFilterDirective;
});
