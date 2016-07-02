import angular from 'angular';

export default function maDatagridInfinitePagination($window, $document) {

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
                page = 1,
                processing = false;
            function handler() {
                if(processing) return;
                processing = true;
                var timer = setInterval(function(){
                    if (body.offsetHeight - $window.innerHeight - $window.scrollY < offset) {
                        if (page >= nbPages) {
                            processing = false;
                            return;
                        }
                        page++;
                        scope.nextPage()(page);
                    } else {
                        processing = false;
                        clearInterval(timer);
                    }
                }, 250);
            }
            handler();
            windowElement.bind('scroll resize', handler);
            scope.$on('$destroy', function destroy() {
                windowElement.unbind('scroll resize', handler);
            });
        }
    };
}

maDatagridInfinitePagination.$inject = ['$window', '$document'];
