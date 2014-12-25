/*global define*/

define(function (require) {
    'use strict';

    function maStringColumn() {
        return {
            restrict: 'E',
            template:
'<div ng-switch="field.isDetailLink()" ng-init="value = entry.values[field.name()]">' +
    '<a ng-switch-when="true" ng-click="gotoDetail(entry)">{{ value }}</a>' +
    '<span ng-switch-default>{{ value }}</span>' +
'</div>'
        };
    }

    maStringColumn.$inject = [];

    return maStringColumn;
});
