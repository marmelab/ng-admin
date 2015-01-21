/*global define*/

define(function (require) {
    'use strict';

    function maColumn($location, $anchorScroll, $compile, Configuration) {
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
                scope.isReference = scope.type == 'Reference' || scope.type == 'ReferenceMany';
                scope.value = scope.entry.values[scope.field.name()];
                if (scope.type == 'ReferencedList') {
                    // special case to avoid recursion
                    element.append('<ma-referenced-list-column field="::field"></ma-referenced-list-column>');
                    $compile(element.contents())(scope);
                    return;
                }
                scope.isDetailLink = function() {
                    if (!scope.isReference) {
                        return scope.field.isDetailLink();
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
            template: 
'<span ng-switch="isDetailLink()">' +
    '<span ng-switch-when="false" ng-switch="type">' + 

        '<ma-string-column   ng-switch-when="choice"    value="::value"></ma-string-column>' +
        '<ma-string-column   ng-switch-when="email"     value="::value"></ma-string-column>' +
        '<ma-string-column   ng-switch-when="number"    value="::value"></ma-string-column>' +
        '<ma-string-column   ng-switch-when="string"    value="::value"></ma-string-column>' +
        '<ma-string-column   ng-switch-when="text"      value="::value"></ma-string-column>' +
        '<ma-boolean-column  ng-switch-when="boolean"   value="::value"></ma-boolean-column>' +
        '<ma-password-column ng-switch-when="password"  value="::value"></ma-password-column>' +
        '<ma-wysiwyg-column  ng-switch-when="wysiwyg"   value="::value|stripTags"></ma-wysiwyg-column>' +
        '<ma-string-column   ng-switch-when="Reference" value="::entry.listValues[field.name()]"></ma-string-column>' +
        '<ma-date-column     ng-switch-when="date"      value="::value" field="::field"></ma-date-column>' +
        '<ma-template-column ng-switch-when="template" entry="::entry" field="::field" entity="::entity"></ma-template-column>' +

        '<ma-reference-many-column ng-switch-when="ReferenceMany" values="::entry.listValues[field.name()]"></ma-reference-many-column>' +

    '</span>' +

    '<span ng-switch-when="true" ng-switch="isReference">' + 
        '<a ng-switch-when="false" ng-click="gotoDetail()" ng-switch="type">' +

            '<ma-string-column   ng-switch-when="choice"   value="::value"></ma-string-column>' +
            '<ma-string-column   ng-switch-when="email"    value="::value"></ma-string-column>' +
            '<ma-string-column   ng-switch-when="number"   value="::value"></ma-string-column>' +
            '<ma-string-column   ng-switch-when="string"   value="::value"></ma-string-column>' +
            '<ma-string-column   ng-switch-when="text"     value="::value"></ma-string-column>' +
            '<ma-boolean-column  ng-switch-when="boolean"  value="::value"></ma-boolean-column>' +
            '<ma-password-column ng-switch-when="password" value="::value"></ma-password-column>' +
            '<ma-wysiwyg-column  ng-switch-when="wysiwyg"  value="::value"></ma-wysiwyg-column>' +
            '<ma-date-column     ng-switch-when="date"     value="::value" field="::field"></ma-date-column>' +
            '<ma-template-column ng-switch-when="template" entry="::entry" field="::field" entity="::entity"></ma-template-column>' +

        '</a>' +

        '<span ng-switch-when="true" ng-switch="type">' + 
            '<a ng-switch-when="Reference" ng-click="gotoReference()">' +
                '<ma-string-column value="::entry.listValues[field.name()]"></ma-string-column>' +
            '</a>' +
            '<ma-reference-many-link-column ng-switch-when="ReferenceMany" ids="::value" values="::entry.listValues[field.name()]" field="::field"></ma-reference-many-link-column>' +
        '</span>' +

    '</span>' +

'</span>'
        };
    }

    maColumn.$inject = ['$location', '$anchorScroll', '$compile', 'NgAdminConfiguration'];

    return maColumn;
});
