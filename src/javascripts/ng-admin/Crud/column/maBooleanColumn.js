/*global define*/

define(function (require) {
    'use strict';

    function maBooleanColumn() {
        return {
            restrict: 'E',
            controller: ['$scope', function (scope) {
                scope.isOk = !!scope.entry.values[scope.field.name()];
            }],
            template: 
'<div ng-switch="field.isDetailLink()">' +
    '<a ng-switch-when="true" ng-click="gotoDetail(entry)">' + 
        '<span class="glyphicon" ng-class="{\'glyphicon-ok\': isOk, \'glyphicon-remove\': !isOk}"></span>'+
    '</a>'+
    '<span ng-switch-default class="glyphicon" ng-class="{\'glyphicon-ok\': isOk, \'glyphicon-remove\': !isOk}"></span>' +
'</div>'
        };
    }

    maBooleanColumn.$inject = [];

    return maBooleanColumn;
});
