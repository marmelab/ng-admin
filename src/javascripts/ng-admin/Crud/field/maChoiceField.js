/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for an element in a list - a select.
     *
     * @example <ma-choice-field field="field" value="value"></ma-choice-field>
     */
    function maChoiceField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var field = scope.field();
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
'<select ng-model="value" ng-required="v.required" id="{{ name }}" name="{{ name }}" class="form-control">' +
  '<option ng-if="!v.required" value="" ng-selected="!value">-- select a value --</option>' +
  '<option ng-repeat="choice in choices" value="{{ choice.value }}" ng-selected="value == choice.value">' +
    '{{ choice.label }}' +
  '</option>' +
'</select>'
        };
    }

    maChoiceField.$inject = [];

    return maChoiceField;
});
