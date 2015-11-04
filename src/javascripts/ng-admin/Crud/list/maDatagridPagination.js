import paginationView from './maDatagridPagination.html';
import DatagridPaginationController from './maDatagridPaginationController';

export default function maDatagridPagination() {
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

maDatagridPagination.$inject = [];
