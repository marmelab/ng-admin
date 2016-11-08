export default function httpErrorHandler($rootScope, notification) {
    $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {
      httpErrorService.handleError(event, toState, toParams, fromState, fromParams, error);
    });
}

errorHandler.$inject = ['$rootScope', 'httpErrorService'];
