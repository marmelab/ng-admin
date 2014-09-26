define(function(require) {
    'use strict';

    var angular = require('angular'),
        quickFilterView = require('text!../../view/quick-filter.html'),
        QuickFilterController = require('ng-admin/Crud/component/controller/directive/QuickFilterController');

    function QuickFilterDirective() {
        return {
            restrict: 'E',
            template: quickFilterView,
            controllerAs: 'quickFilter',
            controller: QuickFilterController
        };
    }

    QuickFilterDirective.$inject = [];

    return QuickFilterDirective;
});
