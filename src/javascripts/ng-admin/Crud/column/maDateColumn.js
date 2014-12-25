/*global define*/

define(function (require) {
    'use strict';

    function maDateColumn() {
        return {
            restrict: 'E',
            template:
'<div ng-switch="field.isDetailLink()" ng-init="value = (entry.values[field.name()] | date:field.format())">' +
    '<a ng-switch-when="true" ng-click="gotoDetail(entry)">{{ value }}</a>' +
    '<span ng-switch-default>{{ value }}</span>' +
'</div>'
        };
    }

    maDateColumn.$inject = [];

    return maDateColumn;
});
