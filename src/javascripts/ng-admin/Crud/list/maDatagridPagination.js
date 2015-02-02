/*global define*/

define(function (require) {
    'use strict';

    var paginationView = require('text!./DatagridPagination.html'),
        DatagridPaginationController = require('./DatagridPaginationController');

    function DatagridPaginationDirective() {
        return {
            restrict: 'E',
            scope: {
                perPage: '=',
                nextPage: '=',
                totalItems: '@',
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
