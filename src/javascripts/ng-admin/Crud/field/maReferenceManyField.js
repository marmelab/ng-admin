/**
 * Edition field for a selection of elements in a list - a multiple select.
 *
 * @example <ma-choices-field entry="entry" field="field" value="value"></ma-choices-field>
 */
require("babel/polyfill");

function maReferenceManyField($compile, ReadQueries) {
    'use strict';

    return {
        scope: {
            'field': '&',
            'value': '=',
            'entry':  '=?',
            'datastore': '&?'
        },
        restrict: 'E',
        compile: function() {
            return {
                pre: function(scope, element) {
                    var field = scope.field();
                    scope.name = field.name();
                    scope.v = field.validation();

                    scope.choices = [];
                    scope.value = [... new Set(scope.value)]; // remove duplicates from array

                    var valueFieldName = field.targetEntity().identifier().name();
                    var labelFieldName = field.targetField().name();

                    scope.refreshChoices = function(search) {
                        var referenceFields = {};
                        referenceFields[scope.name] = field;

                        return ReadQueries.getAllReferencedData(referenceFields, search)
                            .then(r => r[field.name()])
                            .then(results => {
                                return results.map(function(r) {
                                    return {
                                        value: r[valueFieldName],
                                        label: r[labelFieldName]
                                    };
                                });
                            })
                            .then(formattedResults => {
                                // remove already assigned values: ui-select still return them.
                                return formattedResults.filter(fr => scope.value.indexOf(fr.value) === -1);
                            })
                            .then(filteredResults => {
                                scope.choices = filteredResults;
                                scope.$root.$$phase || scope.$apply();
                            });
                    };

                    scope.refreshDelay = field.refreshDelay();

                    var template = `
                        <ui-select ${scope.v.required ? 'ui-select-required' : ''} multiple='true' ng-model="$parent.value" ng-required="v.required" id="{{ name }}" name="{{ name }}">
                            <ui-select-match placeholder="Filter values">{{ $item.label }}</ui-select-match>
                            <ui-select-choices refresh-delay="{{ refreshDelay }}" refresh="refreshChoices($select.search)" repeat="item.value as item in choices | filter: {label: $select.search} track by $index">
                                {{ item.label }}
                            </ui-select-choices>
                        </ui-select>`;

                    element.html(template);

                    var select = element.children()[0];
                    var attributes = field.attributes();
                    for (var name in attributes) {
                        select.setAttribute(name, attributes[name]);
                    }

                    // Pre-fill component with given value if any
                    if (scope.value) {
                        return ReadQueries.getOptimizedReferencedData([field], scope.value)
                            .then(function(r) {
                                scope.choices = r[field.name()].map(v => {
                                    return {
                                        value: v[valueFieldName],
                                        label: v[labelFieldName]
                                    };
                                });

                                $compile(element.contents())(scope);
                            });
                    } else {
                        $compile(element.contents())(scope);
                    }
                }
            };
        }
    };
}

maReferenceManyField.$inject = ['$compile', 'ReadQueries'];

module.exports = maReferenceManyField;
