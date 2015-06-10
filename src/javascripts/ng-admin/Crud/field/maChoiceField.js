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
                for (var name in Object.keys(attributes)) {
                    select[name] = attributes[name];
                }
            },
            template: `
                <ui-select ng-model="$parent.value" ng-required="v.required" id="{{ name }}" name="{{ name }}">
                    <ui-select-match placeholder="Filter values">{{ $select.selected.label }}</ui-select-match>
                    <ui-select-choices repeat="item.value as item in getChoices(entry) | filter: {label: $select.search}">
                        {{ item.label }}
                    </ui-select-choices>
                </ui-select>`
        };
    }

    maChoiceField.$inject = [];

    return maChoiceField;
});
