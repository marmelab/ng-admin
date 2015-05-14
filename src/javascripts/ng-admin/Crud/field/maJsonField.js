/*global define*/

define(function (require) {
    'use strict';

    require('bower_components/codemirror/addon/edit/closebrackets');
    require('bower_components/codemirror/addon/edit/matchbrackets');
    require('bower_components/codemirror/addon/lint/lint');
    require('bower_components/jsonlint/lib/jsonlint');
    require('bower_components/codemirror/addon/lint/json-lint');
    require('bower_components/codemirror/addon/selection/active-line');
    require('bower_components/codemirror/mode/javascript/javascript');

    var
      codemirror = require('bower_components/codemirror/lib/codemirror');

    window.CodeMirror = codemirror;

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
                scope.jsonValue = scope.value === null ? '' : angular.toJson(scope.value, true);
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
                        var value = angular.fromJson(jsonValue);
                        scope.value = value;
                    } catch (e) {
                        // incorrect JSON, do not convert back to value
                    }
                });
            },
            template:
'<textarea ui-codemirror ng-model="jsonValue" id="{{ name }}" name="{{ name }}" ng-required="v.required" ma-json-validator>' +
'</textarea>'
        };
    }

    maJsonField.$inject = [];

    return maJsonField;
});
