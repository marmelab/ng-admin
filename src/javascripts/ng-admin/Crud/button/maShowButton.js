/*global define*/

define(function () {
    'use strict';

    function maShowButtonDirective($state) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                entry: '&',
                size: '@',
                label: '@',
            },
            link: function (scope) {
                scope.label = scope.label || 'Show';

                scope.gotoShow = function () {
                    $state.go($state.get('show'),
                    angular.extend({
                        entity: scope.entity().name(),
                        id: scope.entry().identifierValue
                    }, $state.params));
                };
            },
            template:
'<a class="btn btn-default btn-show" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoShow()">' +
    '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>&nbsp;{{ ::label }}' +
'</a>'
        };
    }

    maShowButtonDirective.$inject = ['$state'];

    return maShowButtonDirective;
});
