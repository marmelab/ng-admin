function maChoiceField($compile) {
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
                    var template = `
                        <ui-select ng-model="$parent.value" ng-required="v.required" id="{{ name }}" name="{{ name }}">
                            <ui-select-match placeholder="Filter values">{{ $select.selected.label }}</ui-select-match>
                            <ui-select-choices repeat="item.value as item in getChoices(entry) | filter: {label: $select.search}">
                                {{ item.label }}
                            </ui-select-choices>
                        </ui-select>`;

                    var field = scope.field();
                    scope.name = field.name();
                    scope.v = field.validation();

                    var choices;
                    if (field.type() === 'reference' || field.type() === 'reference_many') {
                        choices = scope.datastore().getChoices(field);
                    } else {
                        choices = field.choices();
                    }
                    scope.getChoices = typeof(choices) === 'function' ? choices : function() { return choices; };
                    element.html(template);

                    var select = element.children()[0];
                    var attributes = field.attributes();
                    for (var name in attributes) {
                        select.setAttribute(name, attributes[name]);
                    }

                    $compile(element.contents())(scope);
                },

            };
        }
    };
}

maChoiceField.$inject = ['$compile'];

module.exports = maChoiceField;

