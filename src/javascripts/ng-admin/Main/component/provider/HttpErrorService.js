/**
 * HttpError Service
 * 
 * @param {$state} $state
 * @param {$translate} $translate
 * @param {notification} $notification
 */
export default function HttpErrorService($state, $translate, notification) {
    var service = {};

    service.sayHello = sayHello;
    service.handleError = handleError;

    return service;

    function sayHello() {
      return "Hello, World!"
    };
    
    function handleError(event, toState, toParams, fromState, fromParams, error) {
      if (error.status == 404) {
        $state.go('ma-404');
        event.preventDefault();
      } else {
        $translate('STATE_CHANGE_ERROR', { message: error.data }).then(text => notification.log(this.sayHello(), { addnCls: 'humane-flatty-error' }));
        throw error;
      }
    }
}

HttpErrorService.$inject = ['$state', '$translate', 'notification'];
