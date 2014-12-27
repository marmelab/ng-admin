/*global define*/

define(function () {
    'use strict';

    function maBackButtonDirective($window) {
        return {
            restrict: 'E',
            scope: {
                'size': '@'
            },
            link: function ($scope) {
                $scope.back = function () {
                    $window.history.back();
                };
            },
            template:
'<a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="back()">' +
    '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>&nbsp;Back' + 
'</a>'
        };
    }

    maBackButtonDirective.$inject = ['$window'];

    return maBackButtonDirective;
});
