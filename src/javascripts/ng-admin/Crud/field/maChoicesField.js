/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a selection of elements in a list - a multiple select.
     *
     * @example <ma-choices-field entry="entry" field="field" value="value"></ma-choices-field>
     */
    function maChoicesField() {
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
'<select multiple ng-model="value" id="{{ name }}" name="{{ name }}" class="form-control" ng-required="v.required"' +
  ' ng-options="item.value as item.label for item in getChoices(entry)">' +
'</select>'
        };
    }

    maChoicesField.$inject = [];

    return maChoicesField;
});
