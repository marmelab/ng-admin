describe('BatchDeleteController', function () {
    'use strict';

    const BatchDeleteController = require('../../../../ng-admin/Crud/delete/BatchDeleteController'),
        Entity = require('admin-config/lib/Entity/Entity'),
        humane = require('humane-js');

    let $scope;
    beforeEach(inject(function ($controller, $rootScope) {
        $scope = $rootScope.$new();
    }));

    describe('batchDelete', function() {
        const $translate = text => text;
        const $state = {
            current:{
                name: 'list',
                params: {},
            },
            go: jasmine.createSpy('$state.go'),
            get: jasmine.createSpy('$state.get').and.callFake(state => state),
            params: {}
        };
        const progression = {
            start: () => true,
            done: () => true,
        };
        const notification = humane;
        const params = {
            id: 3,
            entity: new Entity('post')
        };
        const HttpErrorService = {
            handleError: jasmine.createSpy('HttpErrorService.handleError')
        };
        let writeQueries;
        describe('on error', function() {
            writeQueries = {
                batchDelete: jasmine.createSpy('writeQueries.deleteOne')
                    .and.callFake(() => Promise.reject("Here's a bad bad bad error"))
            };

            it('should call HttpErrorService handler', (done) => {
                // assume we are on post #3 deletion page
                const entity = new Entity('post');
                const deletedId = 3;
                const view = {
                    title: () => 'Deleting a post',
                    description: () => 'Remove a post',
                    actions: () => [],
                    getEntity: () => entity,
                    fields: () => [],
                };

                let batchDeleteController = new BatchDeleteController($scope, $state, $translate, writeQueries, progression, notification, view, HttpErrorService);

                batchDeleteController.batchDelete(view, 3)
                    .then(() => {
                        assert.fail();
                        done();
                    })
                    .catch(() => {
                        expect(HttpErrorService.handleError.calls.argsFor(0)[5]).toBe("Here's a bad bad bad error")
                        done();
                    });

                const fromStateParams = { entity: 'post', id: 3 };
                $scope.$emit('$stateChangeSuccess', {}, {}, {}, fromStateParams);

                $scope.$digest();
            });
        });
    });
});
