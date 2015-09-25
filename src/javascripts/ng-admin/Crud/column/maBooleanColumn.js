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
                scope.value = scope.value();
            },
            template: '<span class="glyphicon" ng-class="{\'glyphicon-ok\': !!value, \'glyphicon-remove\': !value }"></span>'
        };
    }

    maBooleanColumn.$inject = [];

    return maBooleanColumn;
});
