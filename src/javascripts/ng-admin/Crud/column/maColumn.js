/*global define*/

define(function (require) {
    'use strict';

    function maColumn($location, $anchorScroll, $compile, Configuration, FieldViewConfiguration) {

        function isDetailLink(field) {
            if (field.isDetailLink() === false) {
                return false;
            }
            if (field.type() != 'reference' && field.type() != 'reference_many') {
                return true;
            }
            var referenceEntity = field.targetEntity().name();
            var relatedEntity = Configuration().getEntity(referenceEntity);
            if (!relatedEntity) return false;
            return relatedEntity.isReadOnly ? relatedEntity.showView().isEnabled() : relatedEntity.editionView().isEnabled();
        };

        return {
            restrict: 'E',
            scope: {
                field: '&',
                entry: '&',
                entity: '&'
            },
            link: function(scope, element, attr) {
                scope.field = scope.field();
                scope.entry = scope.entry();
                var type = scope.field.type();
                if (isDetailLink(scope.field)) {
                    element.append(FieldViewConfiguration[type].getLinkWidget());
                } else {
                    element.append(FieldViewConfiguration[type].getReadWidget());
                }
                $compile(element.contents())(scope);
                scope.gotoDetail = function () {
                    this.clearRouteParams();
                    var route = scope.entity().isReadOnly ? 'show' : scope.field.detailLinkRoute();

                    $location.path('/' + route + '/' + scope.entry.entityName + '/' + scope.entry.identifierValue);
                    $anchorScroll(0);
                };
                scope.gotoReference = function () {
                    this.clearRouteParams();
                    var referenceEntity = scope.field.targetEntity().name();
                    var relatedEntity = Configuration().getEntity(referenceEntity);
                    var referenceId = scope.entry.values[scope.field.name()];
                    var route = relatedEntity.isReadOnly ? 'show' : scope.field.detailLinkRoute();
                    $location.path('/' + route + '/' + referenceEntity + '/' + referenceId);
                };
                scope.clearRouteParams = function () {
                    $location.search('q', null);
                    $location.search('page', null);
                    $location.search('sortField', null);
                    $location.search('sortDir', null);
                };
            }
        };
    }

    maColumn.$inject = ['$location', '$anchorScroll', '$compile', 'NgAdminConfiguration', 'FieldViewConfiguration'];

    return maColumn;
});
