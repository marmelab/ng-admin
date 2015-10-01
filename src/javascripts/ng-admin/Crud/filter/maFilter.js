function maFilterDirective(FieldViewConfiguration, $compile) {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            datastore: '&',
            values: '=',
            value: '='
        },
        link: function(scope, element) {
            scope.datastore = scope.datastore();
            element.append(scope.field.getTemplateValue(scope.values) || FieldViewConfiguration[scope.field.type()].getFilterWidget());
            $compile(element.contents())(scope);
        }
    };
}

maFilterDirective.$inject = ['FieldViewConfiguration', '$compile'];

module.exports = maFilterDirective;
