describe('DeleteController', function () {
    'use strict';

    var DeleteController = require('../../../../ng-admin/Crud/delete/DeleteController'),
        Entity = require('admin-config/lib/Entity/Entity'),
        humane = require('humane-js');

    var $scope, $window, $q;
    beforeEach(inject(function ($controller, $rootScope, _$window_, _$q_) {
        $scope = $rootScope.$new();
        $window = _$window_;
        $q = _$q_;
    }));

    describe('deleteOne', function() {
        var $translate = text => text;
        var Configuration = () => ({
            getErrorMessageFor: () => '',
        });
        var $state = {
            go: jasmine.createSpy('$state.go'),
            get: jasmine.createSpy('$state.get').and.callFake(state => state),
            params: {}
        };
        var writeQueries = {
            deleteOne: jasmine.createSpy('writeQueries.deleteOne').and.callFake(() => $q.when())
        };
        var progression = {
            start: () => true,
            done: () => true,
        };
        var notification = humane;
        var params = {
            id: 3,
            entity: new Entity('post')
        };
        var view = {
            title: () => 'My view',
            description: () => 'Description',
            actions: () => [],
            getEntity: () => new Entity('post')
        };
        var entry = {};
        const HttpErrorService = {
            handleError: jasmine.createSpy('HttpErrorService.handleError')
        };
        describe('on success', function() {
            it('should delete given entity', function(done) {
                // assume we are on post #3 deletion page
                const entity = new Entity('post');
                const deletedId = 3;
                const view = {
                    title: () => 'Deleting a post',
                    description: () => 'Remove a post',
                    actions: () => [],
                    getEntity: () => entity
                };

                let deleteController = new DeleteController($scope, $window, $state, $q, $translate, writeQueries, Configuration, progression, notification, {
                    id: deletedId,
                    entity: 'post'
                }, view, entry, HttpErrorService);

                deleteController.deleteOne(view, 3).then(function() {
                    expect(writeQueries.deleteOne).toHaveBeenCalled();
                    done();
                }, done);

                const fromStateParams = { entity: 'post', id: 3 };
                $scope.$emit('$stateChangeSuccess', {}, {}, {}, fromStateParams);

                $scope.$digest();
            });

            it('should redirect to entity list view if previous page is specific to deleted entity', function(done) {
                // assume we are on post #3 deletion page
                const entity = new Entity('post');
                const deletedId = 3;
                const view = {
                    title: () => 'Deleting a post',
                    description: () => 'Remove a post',
                    actions: () => [],
                    getEntity: () => entity
                };

                let deleteController = new DeleteController($scope, $window, $state, $q, $translate, writeQueries, Configuration, progression, notification, {
                    id: deletedId,
                    entity: 'post'
                }, view, entry, HttpErrorService);

                deleteController.deleteOne(view, 3).then(function() {
                    expect($state.get.calls.argsFor(0)[0]).toBe('list');
                    expect($state.go.calls.argsFor(0)[1]).toEqual({
                        entity: 'post'
                    });
                    done();
                }, done);

                // assume we come from post #3 page
                const fromStateParams = { entity: 'post', id: deletedId };
                $scope.$emit('$stateChangeSuccess', {}, {}, {}, fromStateParams);

                $scope.$digest();
            });

            it('should redirect to previous page if not specific to deleted entity', function(done) {
                // assume we are on comment #7 deletion page
                const commentId = 7;
                const view = {
                    title: () => 'Deleting a comment',
                    description: () => 'Remove a comment',
                    actions: () => [],
                    getEntity: () => new Entity('comment')
                };

                let $window = { history: { back: jasmine.createSpy('$window.history.back') } };
                let deleteController = new DeleteController($scope, $window, $state, $q, $translate, writeQueries, Configuration, progression, notification, {
                    id: commentId,
                    entity: 'comment'
                }, view, entry, HttpErrorService);

                deleteController.deleteOne(view, 3).then(function() {
                    expect($window.history.back).toHaveBeenCalled();
                    done();
                }, done);

                // assume we come from post #3 page
                const fromStateParams = { entity: 'post', id: 3 };
                $scope.$emit('$stateChangeSuccess', {}, {}, {}, fromStateParams);

                $scope.$digest();
            });
        });
        describe('on error', function() {
            writeQueries = {
                deleteOne: jasmine.createSpy('writeQueries.deleteOne')
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
                    getEntity: () => entity
                };

                let deleteController = new DeleteController($scope, $window, $state, $q, $translate, writeQueries, Configuration, progression, notification, {
                    id: deletedId,
                    entity: 'post'
                }, view, entry, HttpErrorService);

                deleteController.deleteOne(view, 3)
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
