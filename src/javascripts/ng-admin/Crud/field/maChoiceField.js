function updateChoices(scope, choices) {
    scope.choices = choices;
    scope.$root.$$phase || scope.$digest();
}

export default function maChoiceField($compile) {
    return {
        scope: {
            'field': '&',
            'value': '=',
            'entry':  '=?',
            'datastore': '&?',
            'refresh': '&',
            'choices': '&?'
        },
        restrict: 'E',
        compile: function() {
            return {
                pre: function(scope, element) {
                    var field = scope.field();
                    scope.name = field.name();
                    scope.v = field.validation();
                    scope.$watch('value', function(newValue, oldValue) {
                        if (newValue !== oldValue && newValue === undefined) {
                            // fix for https://github.com/angular-ui/ui-select/issues/863
                            scope.value = null;
                        }
                    });

                    var refreshAttributes = '';
                    var itemsFilter = '| filter: {label: $select.search}';
                    if (field.type().indexOf('reference') === 0 && field.remoteComplete()) { // FIXME wrong place to do that
                        scope.refreshDelay = field.remoteCompleteOptions().refreshDelay;
                        refreshAttributes = 'refresh-delay="refreshDelay" refresh="refresh({ $search: $select.search })"';
                        itemsFilter = '';
                    }

                    var choices = scope.choices ? scope.choices() : (field.choices ? field.choices() : []);
                    var attributes = field.attributes();
                    scope.placeholder = (attributes && attributes.placeholder) || 'Filter values';

                    var template = `
                        <ui-select ng-model="$parent.value" ng-required="v.required" id="{{ name }}" name="{{ name }}">
                            <ui-select-match allow-clear="{{ !v.required }}" placeholder="{{ placeholder }}">{{ $select.selected.label }}</ui-select-match>
                            <ui-select-choices ${refreshAttributes} repeat="item.value as item in choices ${itemsFilter}  track by $index">
                                {{ item.label }}
                            </ui-select-choices>
                        </ui-select>`;

                    scope.choices = typeof(choices) === 'function' ? choices(scope.entry) : choices;
                    element.html(template);

                    var select = element.children()[0];
                    for (var name in attributes) {
                        select.setAttribute(name, attributes[name]);
                    }

                    $compile(element.contents())(scope);
                },
                post: function(scope) {
                    scope.$on('choices:update', function(e, data) {
                        updateChoices(scope, data.choices);
                    });
                }
            };
        }
    };
}

maChoiceField.$inject = ['$compile'];
