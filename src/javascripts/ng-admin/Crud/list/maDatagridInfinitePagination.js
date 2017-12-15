import angular from 'angular';
import lodash from 'lodash';

const isScrollingDown = wheelEvent => {
    if (!wheelEvent) return true;

    return wheelEvent.deltaY > 0;
};

export default function maDatagridInfinitePagination($window, $document) {
    const body = $document[0].body;

    return {
        restrict: 'E',
        scope: {
            perPage: '@',
            totalItems: '@',
            nextPage: '&',
            options: '=',
        },
        link(scope) {
            let offset = 400;
            if(scope.options && scope.options.offset){
                offset = scope.options.offset
            }
            scope.processing = false;
            const perPage = parseInt(scope.perPage, 10) || 1;
            const totalItems = parseInt(scope.totalItems, 10);
            const nbPages = Math.ceil(totalItems / perPage) || 1;
            const loadedPages = [];
            let page = 1;

            const loadNextPage = lodash.debounce(() => {
                if (page >= nbPages) {
                    return;
                }

                page++;

                if (page in loadedPages) {
                    return;
                }

                scope.processing = true;

                loadedPages.push(page);
                scope.nextPage()(page);
                scope.processing = false;
            }, 500, { maxWait: 1000 });

            const isNearBottom = () =>
                body.offsetHeight - $window.innerHeight - $window.scrollY < offset;

            const shouldLoadNextPage = (wheelEvent) =>
                isScrollingDown(wheelEvent) &&
                !scope.processing &&
                isNearBottom()
            ;

            const shouldPreloadNextPage = () => {
                const list = document.getElementsByClassName("list-view");
                if(!list.length){
                    return;
                }
                const { bottom } = list[0].getBoundingClientRect();
                return bottom < $window.innerHeight;
            };

            const handler = (wheelEvent) => {
                if(!shouldLoadNextPage(wheelEvent)){
                    return;
                }
                loadNextPage();
            };

            // Trigger the load only if necessary (as many times as needed)
            // Necessary = the bottom of the table doesn't reach the end of the page
            const shouldPreloadInterval = setInterval(() => {
                if(shouldPreloadNextPage()){
                    loadNextPage();
                    return;
                }
                clearInterval(shouldPreloadInterval);
            }, 100);

            $window.addEventListener('wheel', handler);
            scope.$on('$destroy', () => {
                $window.removeEventListener('wheel', handler);
            });
        }
    };
}

maDatagridInfinitePagination.$inject = ['$window', '$document'];
