/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a boolean - a checkbox.
     *
     * @example <boolean-field field="field" value="value"></boolean-field>
     */
    function BooleanField() {
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
            template: '<input-field type="checkbox" field="field()" value="value"></input-field>'
        };
    }

    BooleanField.$inject = [];

    return BooleanField;
});
