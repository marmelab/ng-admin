export default function HttpErrorHandler($rootScope, HttpErrorService) {
    $rootScope.$on("$stateChangeError", (event, toState, toParams, fromState, fromParams, error) => {
    	HttpErrorService.handleError(event, toState, toParams, fromState, fromParams, error);
    });
}

HttpErrorHandler.$inject = ['$rootScope', 'HttpErrorService'];
