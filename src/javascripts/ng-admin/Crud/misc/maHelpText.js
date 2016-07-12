/**
 * Help text for a form field.
 *
 * @example <ma-help-text field="field"></ma-help-text>
 */
export default function maHelpText() {
    return {
        scope: {
            'field': '&'
        },
        restrict: 'E',
        link: function(scope, element) {
            var field = scope.field();
            scope.helpText = field.helpText();
        },
        template: '<small ng-if="helpText" class="help-block">{{ helpText }}</small>'
    };
}

maHelpText.$inject = [];
