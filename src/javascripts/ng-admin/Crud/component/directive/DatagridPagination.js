define(function(require) {
    'use strict';

    var angular = require('angular'),
        paginationView = require('text!../../view/datagrid-pagination.html'),
        DatagridPaginationController = require('ng-admin/Crud/component/controller/directive/DatagridPaginationController');

    function DatagridPaginationDirective($window, $document) {
        return {
            restrict: 'E',
            template: paginationView,
            controllerAs: 'pagination',
            controller: DatagridPaginationController,
            link: function (scope, element, attrs, controller) {
                var offset = attrs.offset || 100,
                    body = $document[0].body;

                angular.element($window).bind('scroll', function () {
                    if (body.offsetHeight - $window.innerHeight - $window.scrollY < offset) {
                        scope.$apply(controller.nextPage.bind(controller));
                    }
                });
            }
        };
    }

    DatagridPaginationDirective.$inject = ['$window', '$document'];

    return DatagridPaginationDirective;
});
