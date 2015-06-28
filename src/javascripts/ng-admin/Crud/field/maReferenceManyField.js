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
            var field = scope.field();
            scope.name = field.name();
            scope.v = field.validation();
            scope.choices = [];

            function refresh(search) {
                return ReferenceRefresher.refresh(field, scope.value, search)
                    .then(formattedResults => {
                        scope.$broadcast('choices:update', { choices: formattedResults });
                    });
            }

            // if value is set, we should retrieve references label from server
            if (scope.value) {
                ReferenceRefresher.getInitialChoices(field, scope.value)
                    .then(options => {
                        scope.$broadcast('choices:update', { choices: options });

                        if (field.remoteComplete()) {
                            scope.refresh = refresh;
                        } else {
                            refresh();
                        }
                    });
            } else {
                if (field.remoteComplete()) {
                    scope.refresh = refresh;
                } else {
                    refresh();
                }
            }
        },
        template: `<ma-choices-field
                field="field()"
                datastore="datastore()"
                refresh="refresh($search)"
                value="value">
            </ma-choice-field>`
    };
}

maReferenceManyField.$inject = ['ReferenceRefresher'];

module.exports = maReferenceManyField;
