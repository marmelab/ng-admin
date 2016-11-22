describe('Http error Service', function(){
  
    var rootScope, stateProvider;
    var error = {};

  // Mock Ui Router - required for $state dependency
  beforeEach(angular.mock.module('ui.router'));
  // Mock translate
  beforeEach(angular.mock.module('pascalprecht.translate'));
  // Mock notification
  beforeEach(module(function($provide) {
    $provide.service('notification', function() {
    });
  }));

  beforeEach(module(function ($stateProvider, $provide) {
    stateProvider = $stateProvider;
  }));
  
  beforeEach(angular.mock.module('myApp'));
  
  beforeEach(inject(function ($injector) {
    rootScope = $injector.get('$rootScope');
  }));

  beforeEach(inject(function (_httpErrorService_) {
    httpErrorService = _httpErrorService_;
  }));

  beforeEach(inject(function(_$exceptionHandler_) {
    $exceptionHandler = _$exceptionHandler_;
  }));

  it('can get an instance of my httpErrorService', inject(function(httpErrorService) {
    expect(httpErrorService).toBeDefined();
  }));
    
  it('should use my httpErrorService to handle HTTP 403 error', inject(function ($state) {
   
     spyOn(httpErrorService, 'handleError').and.callThrough();
     spyOn(httpErrorService, 'handle403Error').and.callThrough();
     error.status = 403;
     error.data = {};
     error.data.message = 'Forbidden';
     try {
       rootScope.$emit('$stateChangeError', event, null, null, null, error);
      } catch (e) {}

    expect(httpErrorService.handleError).toHaveBeenCalled();
    expect(httpErrorService.handle403Error).toHaveBeenCalled();
  }));
  
  it('should use my httpErrorService handle HTTP 404 error', inject(function ($state) {
   
     spyOn(httpErrorService, 'handleError').and.callThrough();
     spyOn(httpErrorService, 'handle404Error').and.callThrough();
     spyOn($state, 'go').and.callThrough();
     error.status = 404;
     error.data = {};
     error.data.message = '404 Error';
     var event = {preventDefault: jasmine.createSpy()}

     try {
        rootScope.$emit('$stateChangeError', event, null, null, null, error);
     } catch (e) {}

    expect(httpErrorService.handleError).toHaveBeenCalled();
    expect(httpErrorService.handle404Error).toHaveBeenCalled();
    expect($state.go).toHaveBeenCalledWith('ma-404');
		expect(event.preventDefault).toHaveBeenCalled
    }));

  it('should use my httpErrorService handle HTTP errors other than 403/404', inject(function ($state) {
   
     spyOn(httpErrorService, 'handleError').and.callThrough();
     spyOn(httpErrorService, 'handleDefaultError').and.callThrough();
     spyOn(httpErrorService, 'displayError');
     error.status = 500;
     error.data = {};
     error.data.message = '500 Error';
     try {
        rootScope.$emit('$stateChangeError', event, null, null, null, error);   
     } catch (e) {}

    expect(httpErrorService.handleError).toHaveBeenCalled();
    expect(httpErrorService.handleDefaultError).toHaveBeenCalled();
  }));
});
