export default function httpErrorService( $state, $translate, notification) {
    
    return {
    	handle_error: function(event, toState, toParams, fromState, fromParams, error){
            switch (error.status) {
            case 404:
               this.handle_404_error();
            case 403:
               this.handle_403_error(error);
            default:
               this.handle_default_error(error);
            }
    	},
    	handle_404_error: function(event,error){
    		 $state.go('ma-404');
             event.preventDefault();
    	},
    	handle_403_error: function(event,error){
    		 $translate('STATE_FORBIDDEN_ERROR', { message: error.data }).then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
    		 throw error;
    	},        
    	handle_default_error: function(event,error){
    		 $translate('STATE_CHANGE_ERROR', { message: error.message }).then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
             throw error;
    	}    	
    }
}

httpErrorService.$inject = ['$state', '$translate', 'notification'];
