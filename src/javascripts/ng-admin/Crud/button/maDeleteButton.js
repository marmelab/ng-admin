/*global define*/

define(function () {
    'use strict';

    function maDeleteButtonDirective($state) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                entry: '&',
                size: '@',
                label: '@',
            },
            link: function (scope) {
                scope.label = scope.label || 'Delete';

                scope.gotoDelete = function () {
                    $state.go($state.get('delete'), angular.extend({
                        entity: scope.entity().name(),
                        id: scope.entry().identifierValue
                    }, $state.params));
                };
            },
            template:
'<a class="btn btn-default btn-delete" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoDelete()">' +
    '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;{{ ::label }}' +
'</a>'

        };
    }

    maDeleteButtonDirective.$inject = ['$state'];

    return maDeleteButtonDirective;
});
