/**
 * Generic edition field
 *
 * @example <ma-input-field type="text" field="field" value="value"></ma-input-field>
 */
export default function maInputField() {
    return {
        scope: {
            'type': '@',
            'step': '@?',
            'field': '&',
            'value': '='
        },
        restrict: 'E',
        link: function(scope, element) {
            var field = scope.field();
            scope.name = field.name();
            scope.v = field.validation();
            var input = element.children()[0];
            var attributes = field.attributes();
            for (var name in attributes) {
                if (!attributes.hasOwnProperty(name)) continue;
                if (name === 'step') { // allow to use `step` attribute instead of `scope.step`
                    scope.step = attributes[name];
                    continue;
                }

                input.setAttribute(name, attributes[name]);
            }
        },
        template:
`<input type="{{ type || 'text' }}" ng-attr-step="{{ step }}" ng-model="value"
    id="{{ name }}" name="{{ name }}" class="form-control"
    ng-required="v.required" ng-minlength="v.minlength" ng-maxlength="v.maxlength" ng-pattern="v.pattern" />`
    };
}

maInputField.$inject = [];
