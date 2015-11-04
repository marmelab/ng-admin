export default function maTemplateField() {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '&',
            entity: '&',
            value: '=',
            values: '='
        },
        link: function(scope) {
            scope.field = scope.field();
            scope.entry = scope.entry();
            scope.entity = scope.entity();
        },
        template: '<span compile="field.getTemplateValue(entry)"></span>'
    };
}

maTemplateField.$inject = [];
