function maReferenceField(ReferenceRefresher) {
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

            scope.refresh = function(search) {
                return ReferenceRefresher.refresh(field, scope.value, search)
                    .then(formattedResults => {
                        scope.$broadcast('choices:update', { choices: formattedResults });
                    });
            };
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

module.exports = maReferenceField;

