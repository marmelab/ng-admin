define([], function() {
    "use strict";

    /**
     * Display spinner on each route change
     *
     * @param {$rootScope} $rootScope
     * @param {Spinner} Spinner
     */
    function stateSpinner($rootScope, Spinner) {
        $rootScope.$on('$stateChangeStart', Spinner.start.bind(Spinner));
        $rootScope.$on('$stateChangeSuccess', Spinner.stop.bind(Spinner));
    }

    stateSpinner.$inject = ['$rootScope', 'Spinner'];

    return stateSpinner;
});
