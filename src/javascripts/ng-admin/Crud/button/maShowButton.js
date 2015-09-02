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
                    if ($state.params.entity == scope.entity().name()) {
                        // link to the same entity, so preserve active filters
                        $state.go($state.get('show'), angular.extend({
                            entity: scope.entity().name(),
                            id: scope.entry().identifierValue
                        }, $state.params));
                    } else {
                        // link to anoter entity, so forget filters
                        $state.go($state.get('show'), {
                            entity: scope.entity().name(),
                            id: scope.entry().identifierValue
                        });
                    }
                };
            },
            template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoShow()">
    <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>&nbsp;{{ ::label }}
</a>`
        };
    }

    maShowButtonDirective.$inject = ['$state'];

    return maShowButtonDirective;
});
