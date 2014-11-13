/*global define*/

define(function (require) {
    'use strict';

    var booleanColumnView = require('text!../../../view/column/boolean.html');

    function BooleanColumn() {
        return {
            restrict: 'E',
            template: booleanColumnView,
            controller: ['$scope', function ($scope) {
                $scope.isOk = !!$scope.entry.values[$scope.column.field.name()];
            }]
        };
    }

    BooleanColumn.$inject = [];

    return BooleanColumn;
});
