/*global define*/

define(function (require) {
    'use strict';

    function maReferenceManyLinkColumn($location, Configuration) {
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
                var referenceEntity = scope.field.targetEntity().name(),
                    relatedEntity = Configuration().getEntity(referenceEntity);
                scope.gotoReference = function (referenceId) {
                    var route = relatedEntity.isReadOnly ? 'show' : 'edit';
                    $location.path('/' + route + '/' + referenceEntity + '/' + referenceId);
                };
            },
            template:
    '<a ng-repeat="ref in values track by $index" ng-click="gotoReference(ids[$index])" class="multiple">' +
        '<span class="label label-default">{{ ref }}</span>' +
    '</a>'
        };
    }

    maReferenceManyLinkColumn.$inject = ['$location', 'NgAdminConfiguration'];

    return maReferenceManyLinkColumn;
});
