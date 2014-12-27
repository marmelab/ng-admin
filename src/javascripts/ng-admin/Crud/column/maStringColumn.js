/*global define*/

define(function (require) {
    'use strict';

    function maStringColumn() {
        return {
            restrict: 'E',
            scope: {
                value: '&'
            },
            template: '<span>{{ value() }}</span>'
        };
    }

    maStringColumn.$inject = [];

    return maStringColumn;
});
