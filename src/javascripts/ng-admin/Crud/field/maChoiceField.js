function maChoiceField($compile, ReadQueries) {
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

                    scope.refreshDelay = field.refreshDelay();
                    scope.refreshChoices = function(search) {
                        if (!search) {
                            return;
                        }

                        var referenceFields = {};
                        referenceFields[scope.name] = field;

                        return ReadQueries.getAllReferencedData(referenceFields, search)
                            .then(r => r[field.name()])
                            .then((results) => {
                                return results.map(function(r) {
                                    return {
                                        value: r.id,
                                        label: r.title
                                    };
                                });
                            })
                            .then((formattedResults) => {
                                scope.choices = formattedResults
                                scope.$digest();
                            });
                    };

                    var template = `
                        <ui-select ng-model="$parent.value" ng-required="v.required" id="{{ name }}" name="{{ name }}">
                            <ui-select-match allow-clear="{{ !v.required }}" placeholder="Filter values">{{ $select.selected.label }}</ui-select-match>
                            <ui-select-choices refresh-delay="{{ refreshDelay }}" refresh="refreshChoices($select.search)" repeat="item.value as item in choices | filter: {label: $select.search}">
                                {{ item.label }}
                            </ui-select-choices>
                        </ui-select>`;

                    var choices;
                    if (field.type() === 'reference' || field.type() === 'reference_many') {
                        choices = scope.datastore().getChoices(field);
                    } else {
                        choices = field.choices();
                    }
                    scope.choices = typeof(choices) === 'function' ? choices(scope.entry) : choices;
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

maChoiceField.$inject = ['$compile', 'ReadQueries'];

module.exports = maChoiceField;

