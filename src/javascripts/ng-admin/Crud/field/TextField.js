/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a multiline string - a textarea.
     *
     * @example <text-field field="field" value="value"></text-field>
     */
    function TextField() {
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
                scope.v = field.validation();
                var input = element.children()[0];
                var attributes = field.attributes();
                for (var name in attributes) {
                    input[name] = attributes[name];
                }
            },
            template: 
'<textarea ng-model="value" ' +
    'id="{{ name }}" name="{{ name }}" class="{{ fieldClasses }} form-control"' + 
    'ng-required="v.required" ng-minlength="v.minlength" ng-maxlength="v.maxlength">' +
'</textarea>'
        };
    }

    TextField.$inject = [];

    return TextField;
});
