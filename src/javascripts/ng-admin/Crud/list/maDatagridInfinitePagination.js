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

            const handler = (wheelEvent) => {
                if(!shouldLoadNextPage(wheelEvent)){
                    return;
                }
                loadNextPage();
            };

            // Trigger the scroll at least once
            // This way, it loads at least one screen of data to enable further scrolling
            // @see https://github.com/marmelab/ng-admin/issues/681
            loadNextPage();

            $window.addEventListener('wheel', handler);
            scope.$on('$destroy', () => {
                $window.removeEventListener('wheel', handler);
            });
        }
    };
}

maDatagridInfinitePagination.$inject = ['$window', '$document'];
