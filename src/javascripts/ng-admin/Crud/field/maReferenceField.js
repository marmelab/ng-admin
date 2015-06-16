function maReferenceField($compile, ReadQueries) {
    return {
        scope: {
            'field': '&',
            'value': '=',
            'entry':  '=?',
            'datastore': '&?'
        },
        restrict: 'E',
        compile: function() {
            return {
                pre: function(scope, element) {
                    var field = scope.field();
                    scope.name = field.name();
                    scope.v = field.validation();

                    scope.choices = [];

                    scope.refreshChoices = function(search) {
                        var referenceFields = {};
                        referenceFields[scope.name] = field;

                        return ReadQueries.getAllReferencedData(referenceFields, search)
                            .then(r => r[field.name()])
                            .then(results => {
                                var valueFieldName = field.targetEntity().identifier().name()
                                var labelFieldName = field.targetField().name();

                                return results.map(function(r) {
                                    return {
                                        value: r[valueFieldName],
                                        label: r[labelFieldName]
                                    };
                                });
                            })
                            .then(formattedResults => {
                                scope.choices = formattedResults;
                                this.$root.$$phase || scope.$apply();
                            });
                    };

                    scope.refreshDelay = field.refreshDelay();

                    var template = `
                        <ui-select ng-model="$parent.value" ng-required="v.required" id="{{ name }}" name="{{ name }}">
                            <ui-select-match allow-clear="{{ !v.required }}" placeholder="Filter values">{{ $select.selected.label }}</ui-select-match>
                            <ui-select-choices refresh-delay="{{ refreshDelay }}" refresh="refreshChoices($select.search)" repeat="item.value as item in choices | filter: {label: $select.search} track by $index">
                                {{ item.label }}
                            </ui-select-choices>
                        </ui-select>`;


                    element.html(template);

                    var select = element.children()[0];
                    var attributes = field.attributes();
                    for (var name in attributes) {
                        select.setAttribute(name, attributes[name]);
                    }

                    $compile(element.contents())(scope);
                }
            };
        }
    };
}

maReferenceField.$inject = ['$compile', 'ReadQueries'];

module.exports = maReferenceField;

