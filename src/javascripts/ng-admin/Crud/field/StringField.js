/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a one line string - a text input.
     *
     * @example <string-field field="field" value="value"></string-field>
     */
    function StringField() {
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
                $scope.v = field.validation();
            },
            template: '<input type="text" ng-model="value" ' +
                        'id="{{ name }}" name="{{ name }}" class="{{ fieldClasses }} form-control"' + 
                        'ng-required="v.required" ng-minlength="v.minlength" ng-maxlength="v.maxlength"/>'
        };
    }

    StringField.$inject = [];

    return StringField;
});
