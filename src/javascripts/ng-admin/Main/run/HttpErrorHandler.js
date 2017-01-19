export default function HttpErrorHandler($rootScope, HttpErrorService) {
    $rootScope.$on("$stateChangeError", (event, toState, toParams, fromState, fromParams, error) => {
    	HttpErrorService.handleError(error, event, toState, toParams, fromState, fromParams);
    });
}

HttpErrorHandler.$inject = ['$rootScope', 'HttpErrorService'];
