export default function maReferenceField(ReferenceRefresher) {
    return {
        scope: {
            'field': '&',
            'value': '=',
            'entry':  '=?',
            'datastore': '&?'
        },
        restrict: 'E',
        link: function(scope) {
            const field = scope.field();
            const identifierName = field.targetEntity().identifier().name()
            scope.name = field.name();
            scope.v = field.validation();

            if (!field.remoteComplete()) {
                // fetch choices from the datastore, populated during routing resolve
                let initialEntries = scope.datastore()
                    .getEntries(field.targetEntity().uniqueId + '_choices');
                if (scope.value) {
                    const isCurrentValueInInitialEntries = initialEntries.filter(e => e.identifierValue === scope.value).length > 0;
                    if (!isCurrentValueInInitialEntries) {
                        initialEntries.unshift(scope.datastore()
                            .getEntries(field.targetEntity().uniqueId + '_values')
                            .find(entry => entry.values[identifierName] == scope.value)
                        );
                    }
                }
                const initialChoices = initialEntries.map(entry => ({
                    value: entry.values[identifierName],
                    label: entry.values[field.targetField().name()]
                }));
                scope.$broadcast('choices:update', { choices: initialChoices });
            } else {
                if (!!field._getPermanentFilters) {
                    scope.$watch('entry.values', function(newValue, oldValue){
                        field._getPermanentFilters(newValue);
                    }, true);
                }
                // ui-select doesn't allow to prepopulate autocomplete selects, see https://github.com/angular-ui/ui-select/issues/1197
                // let ui-select fetch the options using the ReferenceRefresher
                scope.refresh = function refresh(search) {
                    return ReferenceRefresher.refresh(field, scope.value, search)
                        .then(function addCurrentChoice(results) {
                            if (!search && scope.value) {
                                const isCurrentValueInEntries = results.filter(e => e.value === scope.value).length > 0;
                                if (!isCurrentValueInEntries) {
                                    const currentEntry = scope.datastore()
                                        .getEntries(field.targetEntity().uniqueId + '_values')
                                        .find(entry => entry.values[identifierName] == scope.value);
                                    results.unshift({
                                        value: currentEntry.values[identifierName],
                                        label: currentEntry.values[field.targetField().name()]
                                    });
                                }
                            }
                            return results;
                        })
                        .then(formattedResults => {
                            scope.$broadcast('choices:update', { choices: formattedResults });
                        });
                };
            }
        },
        template: `<ma-choice-field
                field="field()"
                datastore="datastore()"
                refresh="refresh($search)"
                value="value">
            </ma-choice-field>`
    };
}

maReferenceField.$inject = ['ReferenceRefresher'];
