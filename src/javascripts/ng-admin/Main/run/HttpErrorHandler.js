export default function httpErrorHandler($rootScope, $state, $translate, notification) {
    $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {
      httpErrorService.handleError(event, toState, toParams, fromState, fromParams, error);
    });
}

errorHandler.$inject = ['httpErrorService'];
