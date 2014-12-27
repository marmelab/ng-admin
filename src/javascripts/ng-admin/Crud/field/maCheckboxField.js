/*global define*/

define(function (require) {
    'use strict';

    /**
     * Generic edition field
     *
     * @example <ma-checkbox-field type="text" field="field" value="value"></ma-checkbox-field>
     */
    function maCheckboxField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            link: function (scope, element) {
                var field = scope.field();
                scope.name = field.name();
                scope.v = field.validation();
                scope.value = !!scope.value;
                var input = element.children()[0];
                var attributes = field.attributes();
                for (var name in attributes) {
                    input[name] = attributes[name];
                }
            },
            template:
            '<input type="checkbox" ng-model="value" id="{{ name }}" name="{{ name }}" class="form-control" />'
        };
    }

    maCheckboxField.$inject = [];

    return maCheckboxField;
});
