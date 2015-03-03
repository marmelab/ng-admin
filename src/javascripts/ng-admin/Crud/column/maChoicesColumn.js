/*global define*/

define(function (require) {
    'use strict';

    function maChoicesColumn() {
        return {
            restrict: 'E',
            scope: {
                values: '&',
            },
            template: '<span ng-repeat="ref in values() track by $index" class="label label-default">{{ ref }}</span>'
        };
    }

    maChoicesColumn.$inject = [];

    return maChoicesColumn;
});
