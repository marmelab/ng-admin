/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a selection of elements in a list - a multiple select.
     *
     * @example <choices-field field="field" value="value"></choices-field>
     */
    function ChoicesField() {
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
                $scope.choices = field.choices();
                $scope.v = field.validation();
            },
            template: '<select multiple ng-model="value" '+
                        'id="{{ name }}" name="{{ name }}" class="{{ fieldClasses }} form-control" ' + 
                        'ng-options="option as option for option in choices" ' +
                        'ng-required="v.required">' +
                      '</select>'
        };
    }

    ChoicesField.$inject = [];

    return ChoicesField;
});
