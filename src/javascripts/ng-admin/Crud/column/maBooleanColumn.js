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
            template: '<span class="glyphicon" ng-class="{\'glyphicon-ok\': value === true, \'glyphicon-remove\': value === false }"></span>'
        };
    }

    maBooleanColumn.$inject = [];

    return maBooleanColumn;
});
