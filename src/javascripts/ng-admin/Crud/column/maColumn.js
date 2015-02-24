/*global define*/

define(function (require) {
    'use strict';

    var _ = require('lodash');

    function maColumn($location, $anchorScroll, $compile, Configuration, FieldViewConfiguration) {
        var readWidgetTypes = _(FieldViewConfiguration)
            .map(function(fieldView, field) {
                return '<span ng-switch-when="' + field + '">' + fieldView.getReadWidget() +'</span>';
            }).join('');
        var linkWidgetTypes = _(FieldViewConfiguration)
            .map(function(fieldView, field) {
                return '<span ng-switch-when="' + field + '">' + fieldView.getLinkWidget() +'</span>';
            }).join('');
        var template = 
'<span ng-switch="isDetailLink()">' +
    '<span ng-switch-when="false" ng-switch="type">' + readWidgetTypes + '</span>' +
    '<span ng-switch-when="true"  ng-switch="type">' + linkWidgetTypes + '</span>' +
'</span>';
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
                scope.type = scope.field.type();
                if (scope.type == 'referenced_list') {
                    // special case to avoid recursion
                    element.append(
                        '<ma-datagrid name="{{ field.getReferencedView().name() }}" ' +
                             'entries="field.entries" ' +
                             'fields="::field.getReferencedView().fields() | orderElement" ' +
                             'list-actions="::field.listActions()" ' +
                             'entity="::field.getReferencedView().entity">' +
                        '</ma-datagrid>'
                    );
                    $compile(element.contents())(scope);
                    return;
                }
                scope.isDetailLink = function() {
                    if (scope.field.isDetailLink() === false) {
                        return false;
                    }
                    if (!scope.isReference) {
                        return true;
                    }
                    var referenceEntity = scope.field.targetEntity().name();
                    var relatedEntity = Configuration().getEntity(referenceEntity);
                    if (!relatedEntity) return false;
                    return relatedEntity.isReadOnly ? relatedEntity.showView().isEnabled() : relatedEntity.editionView().isEnabled();
                };
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
            },
            template: template
        };
    }

    maColumn.$inject = ['$location', '$anchorScroll', '$compile', 'NgAdminConfiguration', 'FieldViewConfiguration'];

    return maColumn;
});
