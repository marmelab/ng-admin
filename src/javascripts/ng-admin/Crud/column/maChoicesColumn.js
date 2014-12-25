/*global define*/

define(function (require) {
    'use strict';

    function maChoicesColumn() {
        return {
            restrict: 'E',
            template:
'<div ng-switch="field.isDetailLink()">' +
    '<a ng-switch-when="true"  ng-click="gotoDetail(entry)" class="multiple">' +
        '<span ng-repeat="ref in entry.values[field.name()] track by $index" class="label label-default">' +
            '{{ ref }}' +
        '</span>' +
    '</a>' +
    '<span ng-switch-default>' +
        '<span ng-repeat="ref in entry.values[field.name()] track by $index" class="label label-default">' +
            '{{ ref }}' +
        '</span>' +
    '</span>' +
'</div>'
        };
    }

    maChoicesColumn.$inject = [];

    return maChoicesColumn;
});
