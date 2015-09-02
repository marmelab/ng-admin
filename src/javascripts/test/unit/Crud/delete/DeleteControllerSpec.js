var sinon = require('sinon');

describe('DeleteController', function () {
    'use strict';

    var DeleteController = require('../../../../ng-admin/Crud/delete/DeleteController'),
        Entity = require('admin-config/lib/Entity/Entity'),
        humane = require('humane-js');

    var deleteController, $rootScope, $scope, $window, $state, writeQueries, notification, params, view, entry;
    beforeEach(inject(function ($controller, $rootScope, _$window_) {
        $scope = $rootScope.$new();
        $window = _$window_;
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
                var deleteController = new DeleteController($scope, $window, $state, writeQueries, notification, params, view, entry);
                deleteController.deleteOne(view, 3).then(function() {
                    expect(writeQueries.deleteOne.calledOnce).toBeTruthy();
                    done();
                }, done);

                $scope.$digest();
            });

            it('should redirect to entity list view if previous page is specific to deleted entity', function(done) {
                let entity = new Entity('post');
                let deletedId = 3;
                let view = {
                    title: () => 'Deleting a post',
                    description: () => 'Remove a post',
                    actions: () => [],
                    getEntity: () => entity
                };

                let deleteController = new DeleteController($scope, $window, $state, writeQueries, notification, {
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

                $scope.$digest();
            });

            it('should redirect to previous page if not specific to deleted entity', function(done) {
            });

            afterEach(function() {
                sinon.restore();
            });
        });

        describe('on failure', function() {
            it('should redirect to previous page', function() {
            });

            it('should display an error message', function() {
                deleteController.deleteOne();
                expect(deleteController.$scope.selection).toEqual([entries[0]]);
            });
        });
    });
});
