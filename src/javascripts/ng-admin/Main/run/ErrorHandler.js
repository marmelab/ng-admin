export default function errorHandler($rootScope, $state, $translate, notification) {
    $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {
        if (error.status == 404) {
            $state.go('ma-404');
            event.preventDefault();
        } else {
            $translate('STATE_CHANGE_ERROR', { message: error.data }).then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
            throw error;
        }
    });
}

errorHandler.$inject = ['$rootScope', '$state', '$translate', 'notification'];
