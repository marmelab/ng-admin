/*global define*/

define(function () {
    'use strict';

    /**
     * Display loader on each route change
     *
     * @param {$rootScope}  $rootScope
     * @param {$window}     $window
     * @param {progression} progression
     */
    function loader($rootScope, $window, progression) {
        $rootScope.$on('$stateChangeStart', function () {
            progression.start();
        });

        $rootScope.$on('$stateChangeSuccess', function() {
            progression.done();
            $window.scrollTo(0, 0);
        });
    }

    loader.$inject = ['$rootScope', '$window', 'progression'];

    return loader;
});
