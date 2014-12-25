/*global define*/

define(function (require) {
    'use strict';

    function maWysiwygColumn() {
        return {
            restrict: 'E',
            template:
'<div ng-switch="field.isDetailLink()" ng-init="value = entry.values[field.name()]">' +
    '<a ng-switch-when="true" ng-bind-html="value" ng-click="gotoDetail(entry)"></a>' +
    '<span ng-switch-default ng-bind-html="value"></span>' +
'</div>'
        };
    }

    maWysiwygColumn.$inject = [];

    return maWysiwygColumn;
});
