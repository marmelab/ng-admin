/*global define*/

define(function (require) {
    'use strict';

    function maChoicesColumn() {
        return {
            restrict: 'E',
            scope: {
                value: '&',
            },
            template: '<span ng-repeat="ref in value track by $index" class="label label-default">{{ ref }}</span>'
        };
    }

    maChoicesColumn.$inject = [];

    return maChoicesColumn;
});
