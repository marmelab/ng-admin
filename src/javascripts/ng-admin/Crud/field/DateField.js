/*global define*/

define(function (require) {
    'use strict';

    var dateFieldView = require('text!./DateField.html');

    /**
     * Edition field for a date - a text input with a datepicker.
     *
     * @example <date-field field="field" value="value"></date-field>
     */
    function DateField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            link: function($scope) {
                var field = $scope.field();
                $scope.fieldClasses = field.getCssClasses();
                $scope.name = field.name();
                $scope.format = field.format();
                $scope.v = field.validation();
                $scope.isOpen = false;
                $scope.toggleDatePicker = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.isOpen = !$scope.isOpen;
                };
            },
            template: dateFieldView
        };
    }

    DateField.$inject = [];

    return DateField;
});
