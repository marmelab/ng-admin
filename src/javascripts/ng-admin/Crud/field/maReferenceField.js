function maReferenceField(ReadQueries) {
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

            var valueFieldName = field.targetEntity().identifier().name()
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
                        scope.choices = formattedResults;
                        scope.$root.$$phase || scope.$apply();
                    });
            };

            scope.refreshDelay = field.refreshDelay();
        },
        template: `<ma-choice-field
                field="field()"
                datastore="datastore()"
                refresh-delay="refreshDelay"
                refresh="refresh($search)"
                value="value">
            </ma-choice-field>`
    };
}

maReferenceField.$inject = ['ReadQueries'];

module.exports = maReferenceField;

