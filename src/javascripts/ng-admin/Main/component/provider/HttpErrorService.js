export default function httpErrorService($state, $translate, notification) {
    
    return {
    	handleError: function(event, toState, toParams, fromState, fromParams, error){
            switch (error.status) {
            case 404:
               this.handle404Error();
            case 403:
               this.handle403Error(error);
            default:
               this.handleDefaultError(error);
            }
    	},
    	handle404Error: function(event,error){
    		 $state.go('ma-404');
             event.preventDefault();
    	},
    	handle403Error: function(error){
    		 $translate('STATE_FORBIDDEN_ERROR', { message: error.data.message }).then(this.displayError);
    		 throw error;
    	},        
    	handleDefaultError: function(error){
    		 $translate('STATE_CHANGE_ERROR', { message: error.message }).then(this.displayError);
             throw error;
    	},
        displayError:text => notification.log(text, { addnCls: 'humane-flatty-error' })
    }
}

httpErrorService.$inject =['$state', '$translate', 'notification'];
