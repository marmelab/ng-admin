export default function errorHandler($rootScope, $state, notification) {
    $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {
        if (error.status == 404) {
            $state.go('ma-404');
            event.preventDefault();
        } else {
            notification.log('State change error: ' + error.message, { addnCls: 'humane-flatty-error' });
            throw error;
        }
    });
}

errorHandler.$inject = ['$rootScope', '$state', 'notification'];
