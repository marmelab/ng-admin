/*global define*/

define(function (require) {
    'use strict';

    var FilterController = require('./maFilterController');
    var _ = require('lodash');

    function maFilterDirective(FieldViewConfiguration) {
        var filterWidgetTypes = _(FieldViewConfiguration)
            .map(function(fieldView, field) {
                return '<span ng-switch-when="' + field + '">' + fieldView.getFilterWidget() +'</span>';
            }).join('');
        var template = 
'<form class="filters navbar-form well well-sm" ng-if="filterCtrl.shouldFilter()" ng-submit="filterCtrl.filter()">' +
    '<div class="filter form-group" ng-repeat="field in filters track by $index" ng-class="{\'input-group\':field.label()}">' +
        '<label for="{{ field.name() }}" ng-if="field.label() && field.type() != \'boolean\'" class="input-group-addon">' +
            '{{ field.label() }}<span ng-if="field.validation().required">&nbsp;*</span>&nbsp;' +
        '</label>' +
        '<div ng-switch="field.type()" ng-class="field.getCssClasses(entry)">' +
            filterWidgetTypes +
        '</div>' +
    '</div>' +
    '<button class="btn btn-default" type="submit"><span class="glyphicon glyphicon-search"></span> Filter</button>' +
    '<button ng-if="!filterCtrl.isFilterEmpty" class="btn btn-default" type="button" ng-click="filterCtrl.clearFilters()"><span class="glyphicon glyphicon-remove"></span> Clear</button>' +
'</form>';
        return {
            restrict: 'E',
            template: template,
            scope: {
                filters: '&'
            },
            controllerAs: 'filterCtrl',
            controller: FilterController
        };
    }

    maFilterDirective.$inject = ['FieldViewConfiguration'];

    return maFilterDirective;
});
