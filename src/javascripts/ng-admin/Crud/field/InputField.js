/*global define*/

define(function (require) {
    'use strict';

    /**
     * Generic edition field
     *
     * @example <input-field type="text" field="field" value="value"></input-field>
     */
    function InputField() {
        return {
            scope: {
                'type': '@',
                'field': '&',
                'value': '='
            },
            replace: true,
            restrict: 'E',
            link: function($scope) {
                var field = $scope.field();
                $scope.fieldClasses = field.getCssClasses();
                $scope.name = field.name();
                $scope.v = field.validation();
            },
            template: '<input type="{{ type }}" ng-model="value" ' +
                        'id="{{ name }}" name="{{ name }}" class="{{ fieldClasses }} form-control"' + 
                        'ng-required="v.required" ng-minlength="v.minlength" ng-maxlength="v.maxlength">' +
                      '</type>'
        };
    }

    InputField.$inject = [];

    return InputField;
});
