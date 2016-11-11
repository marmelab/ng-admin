export default function HttpErrorService($state, $translate, notification) {
    var service = {};

    service.handleError = handleError;
    service.handle_403 = handle_403;
    service.handle_404 = handle_404;
    service.handle_default = handle_default;
    
    return service;

    function handleError(event, toState, toParams, fromState, fromParams, error) {
      switch (error.status) {
        case 404:
          this.handle_404();
        case 403:
          this.handle_403(error);
        default:
          this.handle_default(error);
      }
    }
    
    function handle_404() {
      $state.go('ma-404');
      event.preventDefault();
    }
    
    function handle_403(error) {
      $translate('STATE_FORBIDDEN_ERROR', { message: error.data }).then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
      throw error;
    }
    
    function handle_default(error) {
      $translate('STATE_CHANGE_ERROR', { message: error.data }).then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
      throw error;
    }
}

HttpErrorService.$inject = ['$state', '$translate', 'notification'];
