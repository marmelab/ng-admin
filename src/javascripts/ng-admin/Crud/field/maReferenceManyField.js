function maReferenceManyField(ReadQueries) {
    'use strict';

    return {
        scope: {
            'field': '&',
            'value': '=',
            'entry':  '=?',
            'datastore': '&?'
        },
        restrict: 'E',
        link: function(scope) {
            var field = scope.field();
            scope.name = field.name();
            scope.v = field.validation();
            scope.choices = [];

            var valueFieldName = field.targetEntity().identifier().name();
            var labelFieldName = field.targetField().name();

            scope.refresh = function(search) {
                var referenceFields = {};
                referenceFields[scope.name] = field;

                return ReadQueries.getAllReferencedData(referenceFields, search)
                    .then(r => r[field.name()])
                    .then(results => {
                        return results.map(function(r) {
                            return {
                                value: r[valueFieldName],
                                label: field.getMappedValue(r[labelFieldName], r)
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
        },
        template: `<ma-choices-field
                field="field()"
                datastore="datastore()"
                refresh-delay="refreshDelay"
                refresh="refresh($search)"
                value="value">
            </ma-choice-field>`
    };
}

maReferenceManyField.$inject = ['ReadQueries'];

module.exports = maReferenceManyField;
