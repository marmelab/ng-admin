/*global define*/

define(function () {
    'use strict';

    function errorHandler($rootScope, $state, $location) {
        $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {
            if (error.status == 404) {
                $state.go('ma-404');
                event.preventDefault();
            } else {
                throw error;
            }
        });
    }

    errorHandler.$inject = ['$rootScope', '$state', '$location'];

    return errorHandler;
});
