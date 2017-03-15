import angular from 'angular';

const isDownScrolling = wheelEvent => {
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
            const perPage = parseInt(scope.perPage, 10) || 1;
            const totalItems = parseInt(scope.totalItems, 10);
            const nbPages = Math.ceil(totalItems / perPage) || 1;
            const loadedPages = [];
            let page = 1;
            let processing = false;
            let interval;

            const handler = (wheelEvent) => {
                if (!isDownScrolling(wheelEvent) || processing || !!interval) {
                    return;
                }

                processing = true;

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
                        processing = false;

                        if (interval) {
                            clearInterval(interval);
                            interval = null;
                        }
                    }
                }, 100);
            };

            // Trigger the scroll at least one
            // In this case, we'll avoid that a pagination of a few element (< 10)
            // will never trigger the pagination
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
