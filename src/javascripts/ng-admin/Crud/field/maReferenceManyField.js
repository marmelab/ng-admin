/**
 * Edition field for a selection of elements in a list - a multiple select.
 *
 * @example <ma-choices-field entry="entry" field="field" value="value"></ma-choices-field>
 */
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
                                if (!scope.value) {
                                    return formattedResults;
                                }

                                // remove already assigned values: ui-select still return them.
                                var selectedValues = scope.value.map(v => v.value);
                                return formattedResults.filter(fr => selectedValues.indexOf(fr.value) === -1);
                            })
                            .then(filteredResults => {
                                scope.choices = filteredResults;
                                scope.$root.$$phase || scope.$apply();
                            });
                    };

                    scope.refreshDelay = field.refreshDelay();

                    var refreshAttributes = scope.refreshDelay !== null ? 'refresh-delay="{{ refreshDelay }}" refresh="refreshChoices($select.search)"' : '';
                    var template = `
                        <ui-select ${scope.v.required ? 'ui-select-required' : ''} multiple='true' ng-model="$parent.value" ng-required="v.required" id="{{ name }}" name="{{ name }}">
                            <ui-select-match placeholder="Filter values">{{ $item.label }}</ui-select-match>
                            <ui-select-choices ${refreshAttributes} repeat="item.value as item in choices | filter: {label: $select.search}">
                                {{ item.label }}
                            </ui-select-choices>
                        </ui-select>`;

                    element.html(template);

                    var select = element.children()[0];
                    var attributes = field.attributes();
                    for (var name in attributes) {
                        select.setAttribute(name, attributes[name]);
                    }

                    // Pre-fill component with given value if no refresh and if value is set
                    if (scope.refreshDelay !== null && scope.value && scope.value.length) {
                        let method = ReadQueries.getFilteredReferenceData;
                        if (field.hasSingleApiCall()) {
                            method = ReadQueries.getOptimizedReferencedData;
                        }

                        method.bind(ReadQueries)([field], [{ tags: scope.value }])
                            .then(function(r) {
                                scope.value = r[field.name()].map(v => {
                                    return {
                                        value: v[valueFieldName],
                                        label: v[labelFieldName]
                                    };
                                });
                                scope.choices = scope.value;

                                $compile(element.contents())(scope);
                            });
                    } else {
                        scope.refreshChoices().then(function() {
                            $compile(element.contents())(scope);
                        });
                    }
                }
            };
        }
    };
}

maReferenceManyField.$inject = ['$compile', 'ReadQueries'];

module.exports = maReferenceManyField;
