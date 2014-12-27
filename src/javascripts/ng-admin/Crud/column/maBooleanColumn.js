/*global define*/

define(function (require) {
    'use strict';

    function maBooleanColumn() {
        return {
            restrict: 'E',
            scope: {
                value: '&',
            },
            link: function(scope) {
                scope.isOk = !!scope.value();
            },
            template: '<span class="glyphicon" ng-class="{\'glyphicon-ok\': isOk, \'glyphicon-remove\': !isOk}"></span>'
        };
    }

    maBooleanColumn.$inject = [];

    return maBooleanColumn;
});
