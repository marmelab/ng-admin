/*global define*/

define(function (require) {
    'use strict';

    function maReferenceManyLinkColumn($state) {
        return {
            restrict: 'E',
            scope: {
                field: '&',
                values: '&',
                ids: '&'
            },
            link: function (scope) {
                scope.field = scope.field();
                scope.values = scope.values();
                scope.ids = scope.ids();
                var relatedEntity = scope.field.targetEntity();
                scope.gotoReference = function (referenceId) {
                    var route = relatedEntity.isReadOnly ? 'show' : 'edit';
                    $state.go(route, { entity: relatedEntity.name(), id: referenceId });
                };
            },
            template:
    '<a ng-repeat="ref in values track by $index" ng-click="gotoReference(ids[$index])" class="multiple">' +
        '<span class="label label-default">{{ ref }}</span>' +
    '</a>'
        };
    }

    maReferenceManyLinkColumn.$inject = ['$state'];

    return maReferenceManyLinkColumn;
});
