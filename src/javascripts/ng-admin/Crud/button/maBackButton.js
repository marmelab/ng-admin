/**
 * Link to previous page
 *
 * Usage:
 * <ma-back-button entry="entry" size="xs"></ma-back-button>
 */
function maBackButtonDirective($window) {
    return {
        restrict: 'E',
        scope: {
            size: '@',
            label: '@',
        },
        link: function (scope) {
            scope.label = scope.label || 'Back';
            scope.back = () => $window.history.back();
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="back()">
<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</a>`
    };
}

maBackButtonDirective.$inject = ['$window'];

module.exports = maBackButtonDirective;
