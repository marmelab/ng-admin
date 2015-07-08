/*global define*/

define(function () {
    'use strict';

    function maBackButtonDirective($window) {
        return {
            restrict: 'E',
            scope: {
                size: '@',
                label: '@',
            },
            link: function ($scope) {
                $scope.label = $scope.label || 'Back';

                $scope.back = function () {
                    $window.history.back();
                };
            },
            template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="back()">
    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>&nbsp;{{ ::label }}
</a>`
        };
    }

    maBackButtonDirective.$inject = ['$window'];

    return maBackButtonDirective;
});
