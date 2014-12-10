/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a number - a number input.
     *
     * @example <number-field field="field" value="value"></number-field>
     */
    function NumberField() {
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
                $scope.a = field.attributes();
                $scope.v = field.validation();
            },
            template: '<input type="number" ng-model="value" '+
                        'id="{{ name }}" name="{{ name }}" class="{{ fieldClasses }} form-control" ' + 
                        'step="{{ a.step || \'any\' }}" ' +
                        'ng-required="v.required" max="{{ v.max }}" min="{{ v.min }}" />'
        };
    }

    NumberField.$inject = [];

    return NumberField;
});
