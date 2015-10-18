function maReferenceManyField(ReferenceRefresher) {
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
            const field = scope.field();
            const identifierName = field.targetEntity().identifier().name();
            scope.name = field.name();
            scope.v = field.validation();
            scope.choices = [];

            const setInitialChoices = (initialEntries) => {
                if (scope.value && scope.value.length) {
                    scope.value.map((value) => {
                        const isCurrentValueInInitialEntries = initialEntries.filter(e => e.identifierValue === value).length > 0;
                        if (value && !isCurrentValueInInitialEntries) {
                            initialEntries.push(scope.datastore()
                                .getEntries(field.targetEntity().uniqueId + '_values')
                                .filter(entry => entry.values[identifierName] == value)
                                .pop()
                            );
                        }
                    });
                }
                const initialChoices = initialEntries.map(entry => ({
                    value: entry.values[identifierName],
                    label: entry.values[field.targetField().name()]
                }));
                scope.$broadcast('choices:update', { choices: initialChoices });
            }

            if (!field.remoteComplete()) {
                // fetch choices from the datastore
                const initialEntries = scope.datastore()
                    .getEntries(field.targetEntity().uniqueId + '_choices');
                setInitialChoices(initialEntries);
            } else {
                const initialEntries = [];
                setInitialChoices(initialEntries);

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
        template: `<ma-choices-field
                field="field()"
                datastore="datastore()"
                refresh="refresh($search)"
                value="value">
            </ma-choices-field>`
    };
}

maReferenceManyField.$inject = ['ReferenceRefresher'];

module.exports = maReferenceManyField;
