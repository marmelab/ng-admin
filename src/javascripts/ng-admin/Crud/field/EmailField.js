/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for an email string - an email input.
     *
     * @example <email-field field="field" value="value"></email-field>
     */
    function EmailField() {
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
            template: '<input type="email" ng-model="value" ' +
                        'id="{{ name }}" name="{{ name }}" class="{{ fieldClasses }} form-control"' + 
                        'ng-required="v.required" ng-minlength="v.minlength" ng-maxlength="v.maxlength"/>'
        };
    }

    EmailField.$inject = [];

    return EmailField;
});
