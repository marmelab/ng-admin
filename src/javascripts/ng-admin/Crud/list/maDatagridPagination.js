import paginationView from './maDatagridPagination.html';
import DatagridPaginationController from './maDatagridPaginationController';

export default function DatagridPaginationDirective() {
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
