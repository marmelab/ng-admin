define(function(require) {
    'use strict';

    var angular = require('angular');
    var booleanColumnView = require('text!../../../view/column/boolean.html');

    function BooleanColumn() {
        return {
            restrict: 'E',
            template: booleanColumnView,
            controller: function($scope) {
                $scope.isOk = !!$scope.entity.getField($scope.column.field.name()).value;
            }
        };
    }

    BooleanColumn.$inject = [];

    return BooleanColumn;
});
