/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a number - a number input.
     *
     * @example <ma-number-field field="field" value="value"></ma-number-field>
     */
    function maNumberField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var field = scope.field();
                scope.fieldClasses = field.getCssClasses();
                scope.name = field.name();
                scope.a = field.attributes();
                scope.v = field.validation();
                var attributes = field.attributes();
                var input = element.children()[0];
                for (var name in attributes) {
                    input[name] = attributes[name];
                }
            },
            template: 
'<input type="number" ng-model="value" '+
    'id="{{ name }}" name="{{ name }}" class="{{ fieldClasses }} form-control" ' + 
    'ng-required="v.required" max="{{ v.max }}" min="{{ v.min }}" />'
        };
    }

    maNumberField.$inject = [];

    return maNumberField;
});
