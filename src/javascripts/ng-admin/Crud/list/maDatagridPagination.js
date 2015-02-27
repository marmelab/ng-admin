/*global define*/

define(function (require) {
    'use strict';

    var paginationView = require('text!./DatagridPagination.html'),
        DatagridPaginationController = require('./DatagridPaginationController');

    function DatagridPaginationDirective() {
        return {
            restrict: 'E',
            scope: {
                page: '@',
                perPage: '@',
                totalItems: '@',
                nextPage: '=',
                infinite: '='
            },
            template: paginationView,
            controllerAs: 'paginationCtrl',
            controller: DatagridPaginationController
        };
    }

    DatagridPaginationDirective.$inject = [];

    return DatagridPaginationDirective;
});
