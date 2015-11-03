export default function maTemplateColumn() {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '&',
            entity: '&'
        },
        link: function(scope) {
            scope.field = scope.field();
            scope.entry = scope.entry();
            scope.entity = scope.entity();
        },
        template: '<span compile="field.getTemplateValue(entry)"></span>'
    };
}

maTemplateColumn.$inject = [];
