/**
 * Edition field for a date - a text input with a datepicker.
 *
 * @example <ma-date-field field="field" value="value"></ma-date-field>
 */
export default function maDateField() {
    return {
        scope: {
            'field': '&',
            'value': '='
        },
        restrict: 'E',
        link: function(scope, element) {
            var field = scope.field();
            scope.name = field.name();
            scope.rawValue = scope.value == null ? null : (scope.value instanceof Date ? scope.value : new Date(scope.value));

            scope.$watch('rawValue', function(newValue) {
                scope.value = field.parse()(newValue);
            });

            scope.$watch('value', (newValue, oldValue) => {
                if (newValue === oldValue) {
                    return;
                }

                if (!newValue) {
                    scope.rawValue = null;
                    return;
                }

                scope.rawValue = scope.value instanceof Date ? scope.value : new Date(new Date(scope.value).getTime() + (new Date().getTimezoneOffset() * 60000));
            });

            scope.format = field.format();
            if (!scope.format) {
                scope.format = field.type() === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss';
            }

            scope.v = field.validation();
            scope.isOpen = false;
            var input = element.find('input').eq(0);
            var attributes = field.attributes();
            for (var name in attributes) {
                input.attr(name, attributes[name]);
            }
            scope.toggleDatePicker = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.isOpen = !scope.isOpen;
            };
        },
        template:
`<div class="input-group datepicker">
    <input
        type="text" ng-model="rawValue" id="{{ name }}" name="{{ name }}" class="form-control"
        uib-datepicker-popup="{{ format }}" is-open="isOpen" ng-required="v.required"
        close-text="{{ 'CLOSE' | translate }}" clear-text="{{ 'CLEAR' | translate }}" current-text="{{ 'CURRENT' | translate }}"/>
    <span class="input-group-btn">
        <button type="button" class="btn btn-default" ng-click="toggleDatePicker($event)">
            <i class="glyphicon glyphicon-calendar"></i>
        </button>
    </span>
</div>`
    };
}

maDateField.$inject = [];
