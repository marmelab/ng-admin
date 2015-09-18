/*global define*/

define(function () {
    'use strict';

    function maCreateButtonDirective($state) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                entityName: '@',
                size: '@',
                label: '@',
                defaultValues: '&'
            },
            link: function (scope, element, attrs) {
                scope.label = scope.label || 'Create';
                var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
                scope.gotoCreate = function () {
                    if ($state.params.entity == entityName) {
                        // link to the same entity, so preserve active filters
                        $state.go($state.get('create'), angular.extend({
                            entity: entityName,
                            defaultValues: scope.defaultValues()
                        }, $state.params));
                    } else {
                        // link to anoter entity, so forget filters
                        $state.go($state.get('create'), {
                            entity: entityName,
                            defaultValues: scope.defaultValues()
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
