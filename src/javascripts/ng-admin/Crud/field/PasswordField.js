/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a secret string - a password input.
     *
     * @example <password-field field="field" value="value"></password-field>
     */
    function PasswordField() {
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
            template: '<input type="password" ng-model="value" ' +
                        'id="{{ name }}" name="{{ name }}" class="{{ fieldClasses }} form-control"' + 
                        'ng-required="v.required" ng-minlength="v.minlength" ng-maxlength="v.maxlength"/>'
        };
    }

    PasswordField.$inject = [];

    return PasswordField;
});
