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
                // fetch choices from the datastore
                let initialEntries = scope.datastore()
                    .getEntries(field.targetEntity().uniqueId + '_choices');
                const isCurrentValueInInitialEntries = initialEntries.filter(e => e.identifierValue === scope.value).length > 0;
                if (scope.value && !isCurrentValueInInitialEntries) {
                    initialEntries.push(scope.datastore()
                        .getEntries(field.targetEntity().uniqueId + '_values')
                        .filter(entry => entry.values[identifierName] == scope.value)
                        .pop()
                    );
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
