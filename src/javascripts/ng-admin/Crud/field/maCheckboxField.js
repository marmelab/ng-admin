/**
 * Generic edition field
 *
 * @example <ma-checkbox-field type="text" field="field" value="value"></ma-checkbox-field>
 */
export default function maCheckboxField() {
    return {
        scope: {
            'field': '&',
            'value': '='
        },
        restrict: 'E',
        link: function (scope, element) {
            var field = scope.field();
            scope.name = field.name();
            scope.v = field.validation();
            scope.value = !!scope.value;
            var input = element.children()[0];
            var attributes = field.attributes();
            for (var name in attributes) {
                if (!attributes.hasOwnProperty(name)) continue;
                input.setAttribute(name, attributes[name]);
            }
        },
        template: `<input type="checkbox" ng-model="value" id="{{ name }}" name="{{ name }}" class="form-control" />`
    };
}

maCheckboxField.$inject = [];
