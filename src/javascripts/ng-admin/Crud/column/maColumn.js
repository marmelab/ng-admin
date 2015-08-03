/*global define*/

define(function (require) {
    'use strict';

    function maColumn($state, $anchorScroll, $compile, Configuration, FieldViewConfiguration) {

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
            return relatedEntity.isReadOnly ? relatedEntity.showView().enabled : relatedEntity.editionView().enabled;
        }

        return {
            restrict: 'E',
            scope: {
                field: '&',
                entry: '&',
                entity: '&',
                datastore: '&'
            },
            link: function(scope, element) {
                scope.datastore = scope.datastore();
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
                    var route = scope.field.detailLinkRoute();
                    if (route == 'edit' && !scope.entity().editionView().enabled) {
                        route = 'show';
                    }
                    $state.go($state.get(route),
                    angular.extend({}, $state.params, {
                        entity: scope.entry.entityName,
                        id: scope.entry.identifierValue
                    }));
                };
                scope.gotoReference = function () {
                    var referenceEntity = scope.field.targetEntity().name();
                    var relatedEntity = Configuration().getEntity(referenceEntity);
                    var referenceId = scope.entry.values[scope.field.name()];
                    var route = relatedEntity.isReadOnly ? 'show' : scope.field.detailLinkRoute();
                    $state.go($state.get(route), {
                        entity: referenceEntity,
                        id: referenceId
                    });
                };
            }
        };
    }

    maColumn.$inject = ['$state', '$anchorScroll', '$compile', 'NgAdminConfiguration', 'FieldViewConfiguration'];

    return maColumn;
});
