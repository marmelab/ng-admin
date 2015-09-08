/*global define*/

define(function () {
    'use strict';

    function maCreateButtonDirective($state) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                size: '@',
                label: '@',
            },
            link: function (scope) {
                scope.label = scope.label || 'Create';

                scope.gotoCreate = function () {
                    if ($state.params.entity == scope.entity().name()) {
                        // link to the same entity, so preserve active filters
                        $state.go($state.get('create'), angular.extend({
                            entity: scope.entity().name(),
                        }, $state.params));
                    } else {
                        // link to anoter entity, so forget filters
                        $state.go($state.get('create'), {
                            entity: scope.entity().name(),
                        });
                    }
                };
            },
            template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoCreate()">
    <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</a>`
        };
    }

    maCreateButtonDirective.$inject = ['$state'];

    return maCreateButtonDirective;
});
