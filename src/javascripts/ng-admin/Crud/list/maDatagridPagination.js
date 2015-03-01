/*global define*/

define(function (require) {
    'use strict';

    var paginationView = require('text!./maDatagridPagination.html'),
        DatagridPaginationController = require('./maDatagridPaginationController');

    function DatagridPaginationDirective() {
        return {
            restrict: 'E',
            scope: {
                page: '@',
                perPage: '@',
                totalItems: '@',
                setPage: '&'
            },
            template: paginationView,
            controllerAs: 'paginationCtrl',
            controller: DatagridPaginationController
        };
    }

    DatagridPaginationDirective.$inject = [];

    return DatagridPaginationDirective;
});
