/*global define*/

define(function (require) {
    'use strict';

    function maNumberColumn() {
        return {
            restrict: 'E',
            scope: {
                value: '&',
                field: '&'
            },
            template: '<span>{{ value() | number:field().format() }}</span>'
        };
    }

    maNumberColumn.$inject = [];

    return maNumberColumn;
});
