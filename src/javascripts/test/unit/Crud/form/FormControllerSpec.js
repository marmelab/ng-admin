describe('FormController', function () {
    'use strict';

    var FormController = require('../../../../ng-admin/Crud/form/FormController'),
        Field = require('admin-config/lib/Field/Field'),
        Entity = require('admin-config/lib/Entity/Entity'),
        humane = require('humane-js');

    let $scope, $injector;
    beforeEach(inject(function ($controller, $rootScope, _$injector_) {
        $scope = $rootScope.$new();
        $injector = _$injector_;
    }));

    const entity = new Entity('post')
        .identifier(new Field('id'));
    const $translate = text => text;
    const Configuration = () => ({
        getErrorMessageFor: () => '',
    });
    const $state = {
        go: jasmine.createSpy('$state.go'),
        get: jasmine.createSpy('$state.get').and.callFake(state => state),
        params: {},
        current:{
            name: 'list',
            params: {},
        }
    };
    let writeQueries = {
        deleteOne: jasmine.createSpy('writeQueries.deleteOne').and.callFake(() => $q.when())
    };
    const progression = {
        start: () => true,
        done: () => true,
    };
    const notification = humane;
    const params = {
        id: 3,
        entity,
    };
    const view = {
        title: () => 'My view',
        description: () => 'Description',
        actions: () => [],
        getEntity: () => entity,
        fields: () => [],
        validate: () => true,
        onSubmitError: () => () => true,
    };
    let entry = {
        transformToRest: () => {},
    };
    const HttpErrorService = {
        handleError: jasmine.createSpy('HttpErrorService.handleError')
    };

    const previousState = {};

    const dataStore = {
        getFirstEntry: jasmine.createSpy('dataStore.getFirstEntry')
            .and.callFake(() => entry),
    };

    const $event = {
        preventDefault: () => {},
    }

    describe('submitCreation', function() {
        describe('on error', function() {
            beforeEach(() => {
                entry = {
                    ...entry,
                    values: {
                        id: 3,
                    }
                };
                writeQueries = {
                    createOne: jasmine.createSpy('writeQueries.createOne')
                        .and.callFake(() => Promise.reject("Here's a bad bad bad error"))
                };
            });

            it('should call HttpErrorService handler', (done) => {
                // assume we are on post #3 deletion page
                const deletedId = 3;

                let formController = new FormController($scope, $state, $injector, $translate, previousState, writeQueries, Configuration, progression, notification, view, dataStore, HttpErrorService);

                formController.form = {
                    $valid: true,
                };

                formController.submitCreation($event)
                    .then(() => {
                        assert.fail();
                        done();
                    })
                    .catch((error) => {
                        expect(HttpErrorService.handleError.calls.argsFor(0)[5]).toBe("Here's a bad bad bad error")
                        done();
                    });

                const fromStateParams = { entity: 'post', id: 3 };
                $scope.$emit('$stateChangeSuccess', {}, {}, {}, fromStateParams);

                $scope.$digest();
            });
        });
    });

    describe('submitEdition', function() {
        describe('on error', function() {

            beforeEach(() => {
                entry = {
                    ...entry,
                    values: {
                        id: 3,
                    }
                };
                writeQueries = {
                    updateOne: jasmine.createSpy('writeQueries.updateOne')
                        .and.callFake(() => Promise.reject("Here's a bad bad bad error"))
                };
            });

            it('should call HttpErrorService handler', (done) => {
                // assume we are on post #3 deletion page
                const deletedId = 3;

                let formController = new FormController($scope, $state, $injector, $translate, previousState, writeQueries, Configuration, progression, notification, view, dataStore, HttpErrorService);

                formController.form = {
                    $valid: true,
                };

                formController.submitEdition($event)
                    .then(() => {
                        assert.fail();
                        done();
                    })
                    .catch((error) => {
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
