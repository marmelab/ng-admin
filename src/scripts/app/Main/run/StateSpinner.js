define([], function() {
    "use strict";

    /**
     * Display spinner on each route change
     *
     * @param {$rootScope} $rootScope
     * @param {$window} $window
     * @param {Spinner} Spinner
     */
    function stateSpinner($rootScope, $window, Spinner) {
        $rootScope.$on('$stateChangeStart', function() {
            Spinner.start();
            $window.scrollTo(0, 0);
        });

        $rootScope.$on('$stateChangeSuccess', Spinner.stop.bind(Spinner));
    }

    stateSpinner.$inject = ['$rootScope', '$window', 'Spinner'];

    return stateSpinner;
});
