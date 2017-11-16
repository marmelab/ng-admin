import angular from 'angular';
import lodash from 'lodash';

const isScrollingDown = wheelEvent => {
    if (!wheelEvent) return true;

    return wheelEvent.deltaY > 0;
};

export default function maDatagridInfinitePagination($window, $document) {
    const offset = 100;
    const body = $document[0].body;

    return {
        restrict: 'E',
        scope: {
            perPage: '@',
            totalItems: '@',
            nextPage: '&'
        },
        link(scope) {
            scope.processing = false;
            const perPage = parseInt(scope.perPage, 10) || 1;
            const totalItems = parseInt(scope.totalItems, 10);
            const nbPages = Math.ceil(totalItems / perPage) || 1;
            const loadedPages = [];
            let page = 1;
            let interval;

            const handler = lodash.debounce((wheelEvent) => {
                if (!isScrollingDown(wheelEvent) || scope.processing || !!interval) {
                    return;
                }

                scope.processing = true;

                interval = setInterval(() => {
                    if (body.offsetHeight - $window.innerHeight - $window.scrollY < offset) {
                        if (page >= nbPages) {
                            return;
                        }

                        page++;

                        if (page in loadedPages) {
                            return;
                        }

                        loadedPages.push(page);
                        scope.nextPage()(page);
                    } else {
                        scope.processing = false;

                        if (interval) {
                            clearInterval(interval);
                            interval = null;
                        }
                    }
                }, 100);
            }, 500, { maxWait: 1000 });

            // Trigger the scroll at least once
            // This way, it loads at least one screen of data to enable further scrolling
            // @see https://github.com/marmelab/ng-admin/issues/681
            handler();

            $window.addEventListener('wheel', handler);
            scope.$on('$destroy', () => {
                $window.removeEventListener('wheel', handler);

                if (interval) {
                    clearInterval(interval);
                }
            });
        }
    };
}

maDatagridInfinitePagination.$inject = ['$window', '$document'];
