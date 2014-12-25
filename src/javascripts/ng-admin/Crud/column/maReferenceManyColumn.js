/*global define*/

define(function (require) {
    'use strict';

    function maReferenceManyColumn($location, Configuration) {
        return {
            restrict: 'E',
            link: function ($scope) {
                var field = $scope.field,
                    referenceEntity = field.targetEntity().name(),
                    relatedEntity = Configuration().getEntity(referenceEntity);

                $scope.hasRelatedAdmin = function () {
                    if (!relatedEntity) return false;
                    return relatedEntity.isReadOnly ? relatedEntity.showView().isEnabled() : relatedEntity.editionView().isEnabled();
                };

                $scope.gotoReference = function (referenceId) {
                    var route = relatedEntity.isReadOnly ? 'show' : 'edit';

                    $location.path('/' + route + '/' + referenceEntity + '/' + referenceId);
                };
            },
            template:
'<div ng-switch="field.isDetailLink() && hasRelatedAdmin()">' +
    '<span ng-switch-when="true" ng-repeat="ref in entry.listValues[field.name()] track by $index">' +
        '<a ng-click="gotoReference(entry.values[field.name()][$index])" class="multiple">' +
            '<span class="label label-default">' +
                '{{ ref }}' +
            '</span>' +
        '</a>' +
    '</span>' +
    '<span ng-switch-default ng-repeat="ref in entry.listValues[field.name()] track by $index">' +
        '<span class="label label-default">' +
            '{{ ref }}' +
        '</span>' +
    '</span>' +
'</div>'
        };
    }

    maReferenceManyColumn.$inject = ['$location', 'NgAdminConfiguration'];

    return maReferenceManyColumn;
});
