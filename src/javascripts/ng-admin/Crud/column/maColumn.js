/*global define*/

define(function (require) {
    'use strict';

    function maColumn($state, $anchorScroll, $compile, Configuration, FieldViewConfiguration) {

        function getDetailLinkRouteName(field, entity) {
            if (entity.isReadOnly) {
                return entity.showView().enabled ? 'show' : false;
            }
            if (field.detailLinkRoute() == 'edit' && entity.editionView().enabled) {
                return 'edit';
            }
            return entity.showView().enabled ? 'show' : false;
        }

        function isDetailLink(field, entity) {
            if (field.isDetailLink() === false) {
                return false;
            }
            if (field.type() == 'reference' || field.type() == 'reference_many') {
                var relatedEntity = Configuration().getEntity(field.targetEntity().name());
                if (!relatedEntity) {
                    return false;
                }
                return getDetailLinkRouteName(field, relatedEntity) !== false;
            }
            return getDetailLinkRouteName(field, entity) !== false;
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
                scope.entity = scope.entity();
                var type = scope.field.type();
                if (isDetailLink(scope.field, scope.entity)) {
                    element.append(FieldViewConfiguration[type].getLinkWidget());
                } else {
                    element.append(FieldViewConfiguration[type].getReadWidget());
                }
                $compile(element.contents())(scope);
                scope.gotoDetail = function () {
                    var route = getDetailLinkRouteName(scope.field, scope.entity);
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
                    var route = getDetailLinkRouteName(scope.field, relatedEntity);
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
