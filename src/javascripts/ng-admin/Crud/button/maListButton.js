/*global define*/

define(function () {
    'use strict';

    /**
     * Link to list
     *
     * Usage:
     * <ma-list-button entity="entity" size="xs"></ma-list-button>
     */
    function maListButtonDirective($state) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                size: '@',
                label: '@',
            },
            link: function (scope) {
                scope.label = scope.label || 'List';
                var parentEntityName = scope.$parent.entity ? scope.$parent.entity.name() : null;
                var entityName = scope.entity().name();

                var params = {
                    entity: entityName
                };
                if (entityName === parentEntityName) {
                    angular.extend(params, $state.params);
                }

                scope.gotoList = function () {
                    $state.go($state.get('list'), params);
                };
            },
            template:
'<a class="btn btn-default btn-list" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoList()">' +
    '<span class="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;{{ ::label }}' +
'</a>'
        };
    }

    maListButtonDirective.$inject = ['$state'];

    return maListButtonDirective;
});
