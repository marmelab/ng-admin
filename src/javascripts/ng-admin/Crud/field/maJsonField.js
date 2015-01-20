/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a JSON string in a textarea.
     *
     * @example <ma-json-field field="field" value="value"></ma-json-field>
     */
    function maJsonField() {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var field = scope.field();
                scope.name = field.name();
                scope.v = field.validation();
                scope.jsonValue = scope.value === null ? '' : JSON.stringify(scope.value);
                var input = element.children()[0];
                var attributes = field.attributes();
                for (var name in attributes) {
                    input[name] = attributes[name];
                }
                scope.$watch('jsonValue', function(jsonValue) {
                    if (jsonValue == '' || typeof jsonValue === 'undefined') {
                        scope.value = null;
                        return;
                    }
                    try {
                        var value = JSON.parse(jsonValue);
                        scope.value = value;
                    } catch (e) {
                        // incorrect JSON, do not convert back to value
                        // FIXME: notify the form that this field is incorrect
                    }
                });
            },
            template: 
'<textarea ng-model="jsonValue" id="{{ name }}" name="{{ name }}" class="form-control" ng-required="v.required">' +
'</textarea>'
        };
    }

    maJsonField.$inject = [];

    return maJsonField;
});
