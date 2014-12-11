/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a selection of elements in a list - a multiple select.
     *
     * @example <ma-choices-field field="field" value="value"></ma-choices-field>
     */
    function maChoicesField() {
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
                scope.choices = field.choices();
                scope.v = field.validation();
                var select = element.children()[0];
                var attributes = field.attributes();
                for (var name in attributes) {
                    select[name] = attributes[name];
                }
            },
            template: 
'<select multiple ng-model="value" '+
    'id="{{ name }}" name="{{ name }}" class="{{ fieldClasses }} form-control" ' + 
    'ng-required="v.required">' +
  '<option ng-repeat="choice in choices" value="{{ choice.value }}" ng-selected="value.indexOf(choice.value) !== -1">' +
    '{{ choice.label }}' +
  '</option>' +
'</select>'
        };
    }

    maChoicesField.$inject = [];

    return maChoicesField;
});
