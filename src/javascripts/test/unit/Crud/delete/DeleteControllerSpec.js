var sinon = require('sinon');

describe('DeleteController', function () {
    'use strict';

    var DeleteController = require('../../../../ng-admin/Crud/delete/DeleteController'),
        Entity = require('admin-config/lib/Entity/Entity'),
        humane = require('humane-js');

    var $scope, $window, $state, $q, writeQueries, notification, params, view, entry;
    beforeEach(inject(function ($controller, $rootScope, _$window_, _$q_) {
        $scope = $rootScope.$new();
        $window = _$window_;
        $q = _$q_;
        $state = {
            go: sinon.spy(),
            get: sinon.spy(),
            params: {}
        };
        writeQueries = { deleteOne: () => {} };
        notification = humane;
        params = {
            id: 3,
            entity: new Entity('post')
        };
        view = {
            title: () => 'My view',
            description: () => 'Description',
            actions: () => [],
            getEntity: () => new Entity('post')
        };
        entry = {};
    }));

    describe('deleteOne', function() {
        describe('on success', function() {
            let writeQueries;
            beforeEach(inject(function($q) {
                writeQueries = { deleteOne: sinon.stub() };
                writeQueries.deleteOne.returns($q.when());
            }));

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

                let deleteController = new DeleteController($scope, $window, $state, $q, writeQueries, notification, {
                    id: deletedId,
                    entity: 'post'
                }, view, entry);

                deleteController.deleteOne(view, 3).then(function() {
                    expect(writeQueries.deleteOne.calledOnce).toBeTruthy();
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

                let deleteController = new DeleteController($scope, $window, $state, $q, writeQueries, notification, {
                    id: deletedId,
                    entity: 'post'
                }, view, entry);

                deleteController.deleteOne(view, 3).then(function() {
                    expect($state.get.firstCall.args[0]).toBe('list');
                    expect($state.go.firstCall.args[1]).toEqual({
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

                let $window = { history: { back: sinon.spy() } };
                let deleteController = new DeleteController($scope, $window, $state, $q, writeQueries, notification, {
                    id: commentId,
                    entity: 'comment'
                }, view, entry);

                deleteController.deleteOne(view, 3).then(function() {
                    expect($window.history.back.calledOnce).toBe(true);
                    done();
                }, done);

                // assume we come from post #3 page
                const fromStateParams = { entity: 'post', id: 3 };
                $scope.$emit('$stateChangeSuccess', {}, {}, {}, fromStateParams);

                $scope.$digest();
            });

            afterEach(function() {
                sinon.restore();
            });
        });
    });
});
