/*global define*/

define(function (require) {
    'use strict';

    function maPasswordColumn() {
        return {
            restrict: 'E',
            template:
'<div ng-switch="field.isDetailLink()">' +
    '<a ng-switch-when="true" ng-click="gotoDetail(entry)">xxx</a>' +
    '<span ng-switch-default>xxx</span>' +
'</div>'
        };
    }

    maPasswordColumn.$inject = [];

    return maPasswordColumn;
});
