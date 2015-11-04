/**
 * Display loader on each route change
 *
 * @param {$rootScope}  $rootScope
 * @param {$window}     $window
 * @param {progression} progression
 */
export default function loader($rootScope, $window, progression) {
    $rootScope.$on('$stateChangeStart', function () {
        progression.start();
    });

    $rootScope.$on('$stateChangeSuccess', function() {
        progression.done();
        $window.scrollTo(0, 0);
    });

    $rootScope.$on("$stateChangeError", function() {
        progression.done();
    });
}

loader.$inject = ['$rootScope', '$window', 'progression'];
