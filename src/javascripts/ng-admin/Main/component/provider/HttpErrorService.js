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
             evenE.preventDefault();
    	},
    	handle403Error: function(event,error){
    		 $translate('STATE_FORBIDDEN_ERROR', { message: error.data }).then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
    		 throw error;
    	},        
    	handleDefaultError: function(event,error){
    		 $translate('STATE_CHANGE_ERROR', { message: error.message }).then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
             throw error;
    	}    	
    }
}

httpErrorService.$inject = ['$state', '$translate', 'notification'];
