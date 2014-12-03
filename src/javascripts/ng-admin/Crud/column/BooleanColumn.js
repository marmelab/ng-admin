/*global define*/

define(function (require) {
    'use strict';

    var booleanColumnView = require('text!./BooleanColumn.html');

    function BooleanColumn() {
        return {
            restrict: 'E',
            template: booleanColumnView,
            controller: ['$scope', function ($scope) {
                $scope.isOk = !!$scope.entry.values[$scope.field.name()];
            }]
        };
    }

    BooleanColumn.$inject = [];

    return BooleanColumn;
});
