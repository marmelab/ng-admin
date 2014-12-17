/*global define*/

define(function (require) {
    'use strict';

    var referenceManyColumnView = require('text!./ReferenceManyColumn.html');

    function ReferenceManyColumn($location, Configuration) {
        return {
            restrict: 'E',
            template: referenceManyColumnView,
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
            }
        };
    }

    ReferenceManyColumn.$inject = ['$location', 'NgAdminConfiguration'];

    return ReferenceManyColumn;
});
