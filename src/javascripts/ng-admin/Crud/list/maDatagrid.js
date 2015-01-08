/*global define*/

define(function (require) {
    'use strict';

    var datagridView = require('text!./Datagrid.html'),
        DatagridController = require('./DatagridController');

    function maDatagridDirective() {
        return {
            restrict: 'E',
            template: datagridView,
            scope: {
                name: '@',
                entries: '=',
                fields: '&',
                listActions: '&',
                entity: '&'
            },
            controllerAs: 'datagrid',
            controller: DatagridController
        };
    }

    maDatagridDirective.$inject = [];

    return maDatagridDirective;
});
