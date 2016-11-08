export default function httpErrorHandler(httpErrorService) {
    $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {
      // Delegate the HTTP error handling to the service
      httpErrorService.handleError(event, toState, toParams, fromState, fromParams, error);
    });
}

errorHandler.$inject = ['httpErrorService'];
