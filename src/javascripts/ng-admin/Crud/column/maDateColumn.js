/*global define*/

define(function (require) {
    'use strict';

    function maDateColumn() {
        return {
            restrict: 'E',
            scope: {
                value: '&',
                field: '&'
            },
            template: '<span>{{ value() | date:field().format() }}</span>'
        };
    }

    maDateColumn.$inject = [];

    return maDateColumn;
});
