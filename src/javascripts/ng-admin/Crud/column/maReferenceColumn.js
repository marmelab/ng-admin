/*global define*/

define(function (require) {
    'use strict';

    function maReferenceColumn($location, Configuration) {
        return {
            restrict: 'E',
            link: function (scope) {
                var field = scope.field;
                var referenceEntity = field.targetEntity().name();
                var relatedEntity = Configuration().getEntity(referenceEntity);

                scope.hasRelatedAdmin = function () {
                    if (!relatedEntity) return false;
                    return relatedEntity.isReadOnly ? relatedEntity.showView().isEnabled() : relatedEntity.editionView().isEnabled();
                };
                scope.gotoReference = function (entry) {
                    var referenceId = entry.values[field.name()];
                    var route = relatedEntity.isReadOnly ? 'show' : 'edit';

                    $location.path('/' + route + '/' + referenceEntity + '/' + referenceId);
                };
            },
            template:
'<div ng-switch="field.isDetailLink() && hasRelatedAdmin()" ng-init="value = entry.listValues[field.name()]">' +
    '<a ng-switch-when="true" ng-click="gotoReference(entry)">{{ value }}</a>' +
    '<span ng-switch-default>{{ value }}</span>' +
'</div>'
        };
    }

    maReferenceColumn.$inject = ['$location', 'NgAdminConfiguration'];

    return maReferenceColumn;
});
