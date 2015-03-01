/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular');

    function DatagridInfinitePaginationDirective($window, $document) {

        var windowElement = angular.element($window);
        var offset = 100,
            body = $document[0].body;

        return {
            restrict: 'E',
            scope: {
                perPage: '@',
                totalItems: '@',
                nextPage: '&'
            },
            link: function(scope) {
                var perPage = parseInt(scope.perPage, 10) || 1,
                    totalItems = parseInt(scope.totalItems, 10),
                    nbPages = Math.ceil(totalItems / perPage) || 1,
                    page = 1;
                function handler() {
                    if (body.offsetHeight - $window.innerHeight - $window.scrollY < offset) {
                        if (page >= nbPages) {
                            return;
                        }
                        page++;
                        scope.nextPage()(page);
                    }
                }
                windowElement.bind('scroll', handler);
                scope.$on('$destroy', function destroy() {
                    windowElement.unbind('scroll', handler);
                });
            }
        };
    }

    DatagridInfinitePaginationDirective.$inject = ['$window', '$document'];

    return DatagridInfinitePaginationDirective;
});
