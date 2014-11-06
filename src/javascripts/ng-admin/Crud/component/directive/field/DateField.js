define(function(require) {
    'use strict';

    var angular = require('angular');
    var dateFieldView = require('text!../../../view/field/date.html');

    function DateField() {
        return {
            restrict: 'E',
            template: dateFieldView,
            controller: ['$scope', function($scope) {
                $scope.isOpen = false;

                $scope.toggleDatePicker = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.isOpen = !$scope.isOpen;
                }
            }]
        };
    }

    DateField.$inject = [];

    return DateField;
});
