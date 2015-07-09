/*global define*/

define(function () {
    'use strict';

    function maEditButtonDirective($state) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                entry: '&',
                size: '@',
                label: '@',
            },
            link: function (scope) {
                scope.label = scope.label || 'Edit';
                scope.gotoEdit = function () {
                    $state.go($state.get('edit'),
                    angular.extend({
                        entity: scope.entity().name(),
                        id: scope.entry().identifierValue
                    }, $state.params));
                };
            },
            template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoEdit()">
    <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>&nbsp;{{ ::label }}
</a>`
        };
    }

    maEditButtonDirective.$inject = ['$state'];

    return maEditButtonDirective;
});
