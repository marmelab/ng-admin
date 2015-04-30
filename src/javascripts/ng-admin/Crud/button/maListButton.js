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

                scope.gotoList = function () {
                    $state.go($state.get('list'), { 'entity': scope.entity().name() });
                };
            },
            template:
'<a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoList()">' +
    '<span class="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;{{ ::label }}' +
'</a>'
        };
    }

    maListButtonDirective.$inject = ['$state'];

    return maListButtonDirective;
});
