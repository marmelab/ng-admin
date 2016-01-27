/**
 * Edition field for a selection of elements in a list - a multiple select.
 *
 * @example <ma-choices-field entry="entry" field="field" value="value"></ma-choices-field>
 */
export default function maChoicesField($compile) {
    'use strict';

    return {
        scope: {
            'field': '&',
            'value': '=',
            'entry':  '=?',
            'datastore': '&?',
            'refresh': '&'
        },
        restrict: 'E',
        compile: function() {
            return {
                pre: function(scope, element) {
                    var field = scope.field();
                    scope.name = field.name();
                    scope.v = field.validation();

                    var refreshAttributes = '';
                    var itemsFilter = '| filter: {label: $select.search}';
                    if (field.type().indexOf('reference') === 0 && field.remoteComplete()) {
                        scope.refreshDelay = field.remoteCompleteOptions().refreshDelay;
                        refreshAttributes = 'refresh-delay="refreshDelay" refresh="refresh({ $search: $select.search })"';
                        itemsFilter = '';
                    }

                    var choices = field.choices ? field.choices() : [];
                    var attributes = field.attributes();
                    scope.placeholder = (attributes && attributes.placeholder) || 'Filter values';

                    scope.onRemove = function() {
                        scope.refresh({ $search: this.$select.search })
                     }

                    var template = `
                        <ui-select ${scope.v.required ? 'ui-select-required' : ''} multiple on-remove="onRemove()" ng-model="$parent.value" ng-required="v.required" id="{{ name }}" name="{{ name }}">
                            <ui-select-match placeholder="{{ placeholder }}">{{ $item.label }}</ui-select-match>
                            <ui-select-choices ${refreshAttributes} repeat="item.value as item in choices ${itemsFilter}">
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
                        scope.choices = data.choices;
                        scope.$root.$$phase || scope.$digest();
                    });
                }
            };
        }
    };
}

maChoicesField.$inject = ['$compile'];
