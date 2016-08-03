/**
 * Help text for a form field.
 *
 * @example <ma-help-text field="field"></ma-help-text>
 *
 * @param field.helpText()  If a string, it will be displayed as text to the user.
 *                          If an `angular.element`, it will be compiled and displayed.
 *                          You can use "entry.values[x]" to check the current value
 *                          of property "x" (e.g. if you want to give different hints)
 */
export default function maHelpText($compile) {
    return {
        scope: true,
        restrict: 'E',
        link: function(scope, element) {
            var field = scope.field;

            var helpText = field && field.helpText();
            if (helpText && typeof helpText === "object" && helpText.contents) {
                // looks like an angular.element:
                element.append(helpText.clone());
                $compile(element.contents())(scope);
            } else {
                // treat as plain text:
                scope.helpText = helpText;
            }
        },
        template: '<small ng-if="helpText" class="help-block">{{ helpText }}</small>'
    };
}

maHelpText.$inject = ['$compile'];
