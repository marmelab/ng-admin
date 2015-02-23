/*global define*/

define(function (require) {
    'use strict';

    function maDateTimeColumn() {
        return {
            restrict: 'E',
            scope: {
                value: '&',
                field: '&'
            },
            template: '<span>{{ value() | date:field().format() }}</span>'
        };
    }

    maDateTimeColumn.$inject = [];

    return maDateTimeColumn;
});
