define([], function() {
    "use strict";

    function stateSpinner($rootScope, Spinner) {
        $rootScope.$on('$stateChangeStart', function(event, next, current) {
            Spinner.start();
        });

        $rootScope.$on('$stateChangeSuccess', function(event, next, current) {
            Spinner.stop();
        });
    }

    stateSpinner.$inject = ['$rootScope', 'Spinner'];

    return stateSpinner;
});
