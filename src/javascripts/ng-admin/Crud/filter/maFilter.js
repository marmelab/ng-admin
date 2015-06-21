var FilterController = require('./maFilterController');
var _ = require('lodash');

function maFilterDirective(FieldViewConfiguration) {
    'use strict';

    var filterWidgetTypes = _(FieldViewConfiguration)
        .map(function(fieldView, field) {
            return '<span ng-switch-when="' + field + '">' + fieldView.getFilterWidget() +'</span>';
        }).join('');

    var template = `
        <form class="filters col-md-8 form-horizontal" ng-if="filterCtrl.shouldFilter()" ng-submit="filterCtrl.filter()">
            <div class="filter form-group input-{{ field.type() }}" ng-repeat="field in filters track by $index">
                <div class="col-sm-1 col-xs-1 remove_filter">
                    <a ng-click="filterCtrl.removeFilter(field)"><span class="glyphicon glyphicon-remove"></span></a>
                </div>
                <label for="{{ field.name() }}" class="col-sm-2 col-xs-11 control-label">
                    {{ field.label() }}<span ng-if="field.validation().required">&nbsp;*</span>&nbsp;
                </label>
                <div class="col-sm-8" ng-switch="field.type()" ng-class="field.getCssClasses(entry)">
                    ${filterWidgetTypes}
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-3 col-sm-10">
                    <button class="btn btn-default" type="submit">
                        <span class="glyphicon glyphicon-search"></span> Filter
                    </button>
                    <button ng-if="!filterCtrl.isFilterEmpty" class="btn btn-default" type="button" ng-click="filterCtrl.clearFilters()">
                        <span class="glyphicon glyphicon-remove"></span> Clear
                    </button>
                </div>
            </div>
        </form>
    `;

    return {
        restrict: 'E',
        template: template,
        scope: {
            filters: '=',
            datastore: '&',
            values: '&'
        },
        controllerAs: 'filterCtrl',
        controller: FilterController
    };
}

maFilterDirective.$inject = ['FieldViewConfiguration'];

module.exports = maFilterDirective;
