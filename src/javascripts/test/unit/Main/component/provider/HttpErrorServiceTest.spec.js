const HttpErrorServiceProvider = require('../../../../../ng-admin/Main/component/provider/HttpErrorService');

describe('Http Error Service', () => {
    let $state;
    let $translate;
    let HttpErrorService;
    let notification;

    angular.module('test_HttpErrorService', [])
        .service('$state', () => ({
            go: jasmine.createSpy('$state.go'),
        }))
        .service('$translate', () => (
            jasmine.createSpy('$translate').and.returnValue({ then: cb => cb('translated') })
        ))
        .service('notification', () => ({
            log: jasmine.createSpy('notification.log'),
        }))
        .provider('HttpErrorService', HttpErrorServiceProvider);

    beforeEach(angular.mock.module('test_HttpErrorService'));

    beforeEach(inject(function (_$state_, _$translate_, _HttpErrorService_, _notification_) {
        $state = _$state_;
        $translate = _$translate_;
        HttpErrorService = _HttpErrorService_;
        notification = _notification_;
    }));

    it('should redirect to `ma-404` state when receiving a 404 error', () => {
        const event = {
            preventDefault: jasmine.createSpy(),
        };

        const error = { status: 404 };
        HttpErrorService.handleError(event, '', '', '', '', error);

        expect(event.preventDefault).toHaveBeenCalled();
        expect($state.go).toHaveBeenCalledWith('ma-404');
    });

    it('should display a translated forbidden error notification in case of 403', () => {
        const error = {
            status: 403,
            data: {
                message: 'Forbidden access',
            },
        };

        try {
            HttpErrorService.handleError('', '', '', '', '', error);
            expect(true).toBe(false);
        } catch (e) {
            // should throw an exception in case of 403
        }

        expect($translate).toHaveBeenCalledWith('STATE_FORBIDDEN_ERROR', { message: 'Forbidden access' });
        expect(notification.log).toHaveBeenCalledWith('translated', { addnCls: 'humane-flatty-error' });
    });

    it('should display generic translated error notification if neither 404 nor 403', () => {
        const error = {
            status: 500,
            data: {
              message: 'Unknown error',
            }
        };

        try {
            HttpErrorService.handleError('', '', '', '', '', error);
            expect(true).toBe(false);
        } catch (e) {
            // should throw an exception in case of 500
        }

        expect($translate).toHaveBeenCalledWith('STATE_CHANGE_ERROR', { message: 'Unknown error' });
        expect(notification.log).toHaveBeenCalledWith('translated', { addnCls: 'humane-flatty-error' });
    });
});
