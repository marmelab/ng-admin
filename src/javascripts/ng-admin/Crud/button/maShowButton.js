/*global define*/

define(function () {
    'use strict';

    function maShowButtonDirective($location) {
        return {
            restrict: 'E',
            scope: {
                'entity': '&',
                'entry': '&',
                'size': '@'
            },
            link: function ($scope) {
                $scope.gotoShow = function () {
                    var entity = $scope.entity();
                    $location.path('/show/' + entity.name() + '/' + $scope.entry().identifierValue);
                };
            },
            template:
'<a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoShow()">' +
    '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>&nbsp;Show' +
'</a>'
        };
    }

    maShowButtonDirective.$inject = ['$location'];

    return maShowButtonDirective;
});
