/**
 * Save button
 *
 * Usage:
 * <ma-submit-button label="Save changes"></ma-submit-button>
 */
export default function maSubmitButtonDirective() {
    return {
        restrict: 'E',
        scope: {
            label: '@',
        },
        link: function (scope) {
            scope.label = scope.label || 'Save';
        },
        template: '<button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-ok"></span> {{ label }}</button>'
    };
}

maSubmitButtonDirective.$inject = [];
