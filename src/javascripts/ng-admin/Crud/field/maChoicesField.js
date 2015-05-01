/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a selection of elements in a list - a multiple select.
     *
     * @example <ma-choices-field entry="entry" field="field" value="value"></ma-choices-field>
     */
    function maChoicesField(DataStore) {
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
                scope.contains = contains;
            },
            template: 
'<select multiple ng-model="value" id="{{ name }}" name="{{ name }}" class="form-control" ng-required="v.required">' +
  '<option ng-repeat="choice in getChoices(entry)" value="{{ choice.value }}" ng-selected="contains(value, choice.value)">' +
    '{{ choice.label }}' +
  '</option>' +
'</select>'
        };
    }

    function contains (collection, item) {
        if (!collection) {
            return false;
        }
        for (var i = 0, l = collection.length; i < l; i++) {
            if (collection[i] == item) { // == is intentional here
                return true;
            }
        }
        return false;
    }

    maChoicesField.$inject = ['DataStore'];

    return maChoicesField;
});
