function maChoiceField($compile) {
    return {
        scope: {
            'field': '&',
            'value': '=',
            'entry':  '=?',
            'datastore': '&?',
            'refresh': '&',
            'refreshDelay': '='
        },
        restrict: 'E',
        compile: function() {
            return {
                pre: function(scope, element) {
                    var field = scope.field();
                    scope.name = field.name();
                    scope.v = field.validation();

                    var template = `
                        <ui-select ng-model="$parent.value" ng-required="v.required" id="{{ name }}" name="{{ name }}">
                            <ui-select-match allow-clear="{{ !v.required }}" placeholder="Filter values">{{ $select.selected.label }}</ui-select-match>
                            <ui-select-choices refresh-delay="refreshDelay" refresh="refresh({ $search: $select.search })" repeat="item.value as item in choices | filter: {label: $select.search} track by $index">
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

maChoiceField.$inject = ['$compile'];

module.exports = maChoiceField;

