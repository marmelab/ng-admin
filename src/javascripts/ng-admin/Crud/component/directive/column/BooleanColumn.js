/*global define*/

define(function (require) {
    'use strict';

    var booleanColumnView = require('text!../../../view/column/boolean.html');

    function BooleanColumn() {
        return {
            restrict: 'E',
            template: booleanColumnView,
            controller: ['$scope', function ($scope) {
                $scope.isOk = !!$scope.entry.getField($scope.column.field.name()).value();
            }]
        };
    }

    BooleanColumn.$inject = [];

    return BooleanColumn;
});
