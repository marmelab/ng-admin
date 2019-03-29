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
            isDisabled: '<?'
        },
        link: function (scope) {
            scope.label = scope.label || 'SAVE';
        },
        template: '<button type="submit" class="btn btn-primary" ng-disabled="isDisabled"><span class="glyphicon glyphicon-ok"></span>&nbsp;<span class="hidden-xs" translate="{{ ::label }}"></span></button>'
    };
}

maSubmitButtonDirective.$inject = [];
