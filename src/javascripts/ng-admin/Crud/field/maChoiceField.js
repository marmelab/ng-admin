/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for an element in a list - a select.
     *
     * @example <ma-choice-field entry="entry" field="field" value="value"></ma-choice-field>
     */
    function maChoiceField() {
        return {
            scope: {
                'field': '&',
                'value': '=',
                'entry':  '=?',
                'datastore': '&?'
            },
            restrict: 'E',
            link: function(scope, element) {
                var field = scope.field();
                scope.name = field.name();
                scope.v = field.validation();
                var choices;
                if (field.type() === 'reference' || field.type() === 'reference_many') {
                    choices = scope.datastore().getChoices(field);
                } else {
                    choices = field.choices();
                }
                scope.getChoices = typeof(choices) === 'function' ? choices : function() { return choices; };
                var select = element.children()[0];
                var attributes = field.attributes();
                for (var name in attributes) {
                    select[name] = attributes[name];
                }
            },
            template:
'<select ng-model="value" ng-required="v.required" id="{{ name }}" name="{{ name }}" class="form-control"' +
  ' ng-options="item.value as item.label for item in getChoices(entry)">' +
  '<option value="">-- select a value --</option>' +
'</select>'
        };
    }

    maChoiceField.$inject = [];

    return maChoiceField;
});
