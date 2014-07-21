define([], function() {
    "use strict";

    function stateSpinner($rootScope, Spinner) {
        $rootScope.$on('$stateChangeStart', Spinner.start.bind(Spinner));
        $rootScope.$on('$stateChangeSuccess', Spinner.stop.bind(Spinner));
    }

    stateSpinner.$inject = ['$rootScope', 'Spinner'];

    return stateSpinner;
});
