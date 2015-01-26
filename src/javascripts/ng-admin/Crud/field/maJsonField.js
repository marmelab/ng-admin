/*global define*/

define(function (require) {
    'use strict';

    require([
        'bower_components/codemirror/lib/codemirror',
        'bower_components/codemirror/addon/edit/closebrackets',
        'bower_components/codemirror/addon/edit/matchbrackets',
        'bower_components/codemirror/addon/lint/lint',
        'bower_components/jsonlint/lib/jsonlint',
        'bower_components/codemirror/addon/lint/json-lint',
        'bower_components/codemirror/addon/selection/active-line',
        'bower_components/codemirror/mode/javascript/javascript'
    ], function(codemirror) {
        codemirror.defineOption("matchBrackets", true);
        codemirror.defineOption("autoCloseBrackets", true);
        codemirror.defineOption("lineWrapping", true);
        codemirror.defineOption("tabSize", 2);
        codemirror.defineOption("mode", "application/json");
        codemirror.defineOption("gutters", ["CodeMirror-lint-markers"]);
        codemirror.defineOption("lint", true);
        codemirror.defineOption("styleActiveLine", true);

        window.CodeMirror = codemirror;
    });

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
