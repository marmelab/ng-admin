define([
    'nprogress'
], function(NProgress) {
    "use strict";

    /**
     * Display loader on each route change
     *
     * @param {$rootScope} $rootScope
     * @param {$window} $window
     */
    function loader($rootScope, $window) {
        $rootScope.$on('$stateChangeStart', function() {
            NProgress.start();
            $window.scrollTo(0, 0);
        });

        $rootScope.$on('$stateChangeSuccess', NProgress.done.bind(NProgress));
    }

    loader.$inject = ['$rootScope', '$window'];

    return loader;
});
