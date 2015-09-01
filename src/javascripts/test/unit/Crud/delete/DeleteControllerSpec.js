var sinon = require('sinon');

describe('DeleteController', function () {
    'use strict';

    var DeleteController = require('../../../../ng-admin/Crud/delete/DeleteController'),
        Entity = require('admin-config/lib/Entity/Entity'),
        humane = require('humane-js'),
        WriteQueries = require('admin-config/lib/Queries/WriteQueries');

    var deleteController;

    var $scope, $window, $state, WriteQueries, notification, params, view, entry;
    beforeEach(inject(function ($rootScope, _$window_, _WriteQueries_) {
        $scope = $rootScope.$new();
        $window = _$window_;
        // $state = _$state_;
        WriteQueries = _WriteQueries_;
        notification = humane;
        params = {
            id: 3,
            entity: new Entity()
        };
        view = {
            title: () => 'My view',
            description: () => 'Description',
            actions: () => [],
            getEntity: () => new Entity()
        };
        entry = {};
    }));

    describe('deleteOne', function() {
        describe('on success', function() {
            fit('should delete given entity', function(done) {
                var writeQueries = WriteQueries();
                var deleteOneSpy = sinon.spy(writeQueries, 'deleteOne');
                var deleteController = new DeleteController($scope, $window, $state, writeQueries, notification, params, view, entry);
                deleteController.deleteOne().then(function() {
                    expect(deleteOneSpy).to.be.called();
                    done();
                }, done);
            });

            it('should redirect to entity list view', function(done) {
            });

            it('should display a success notification', function() {
                deleteController.deleteOne().then(function() {

                });
                expect(deleteController.$scope.selection).toEqual([entries[0]]);
            });

            afterEach(function() {
                WriteQueries.deleteOne.restore();
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
