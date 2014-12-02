/*global define*/

define(function (require) {
    'use strict';

    var referenceColumnView = require('text!../../../view/column/reference.html');

    function ReferenceColumn($location, Configuration) {
        return {
            restrict: 'E',
            template: referenceColumnView,
            link: function ($scope) {
                var field = $scope.field;
                var referenceEntity = field.targetEntity().name();
                var relatedEntity = Configuration().getEntity(referenceEntity);
                $scope.hasRelatedAdmin = function() {
                    if (!relatedEntity) return false;
                    return relatedEntity.editionView().isEnabled();
                };
                $scope.gotoReference = function (entry) {
                    var referenceId = entry.values[field.name()];
                    $location.path('/edit/' + referenceEntity + '/' + referenceId);
                };
            }
        };
    }

    ReferenceColumn.$inject = ['$location', 'NgAdminConfiguration'];

    return ReferenceColumn;
});
