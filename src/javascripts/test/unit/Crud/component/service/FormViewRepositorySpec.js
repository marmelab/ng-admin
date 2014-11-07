/*global define,jasmine,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var FormViewRepository = require('ng-admin/Crud/component/service/FormViewRepository'),
        CreateView = require('ng-admin/Main/component/service/config/view/CreateView'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        config,
        entity,
        view;

    describe("Service: FormViewRepository", function () {

        beforeEach(function () {
            config = function () {
                return {
                    baseApiUrl: angular.noop
                };
            };

            entity = new Entity('cat');
            view = new CreateView('myFormView')
                .addField(new Field('id').identifier(true))
                .addField(new Field('name').type('text'));

            entity.addView(view);

            view.extraParams(null);
            view.interceptor(null);
        });

        describe("getOne", function () {

            it('should return the entity with all fields.', function () {
                Restangular.get = jasmine.createSpy('get').andReturn(mixins.buildPromise({
                    data: {
                        "id": 1,
                        "name": "Mizoute",
                        "summary": "A Cat"
                    }
                }));

                var formViewRepository = new FormViewRepository({}, Restangular, config);

                formViewRepository.getOne(view, 1)
                    .then(function (entry) {
                        expect(Restangular.one).toHaveBeenCalledWith('cat', 1);
                        expect(entry.identifierValue).toBe(1);
                        expect(entry.values.id).toBe(1);
                        expect(entry.values.name).toBe('Mizoute');

                        // Non mapped field should not be retrieved
                        expect(entry.values.summary).toBe(undefined);
                    });
            });

            it('should add response interceptor, extra params & headers when calling getOne', function () {
                var catInterceptor;
                view.interceptor(catInterceptor = function () {
                });

                view.extraParams(function () {
                    return {
                        key: 'abc'
                    };
                });

                view.headers(function () {
                    return {
                        pwd: '123456'
                    };
                });

                Restangular.addResponseInterceptor = jasmine.createSpy('addResponseInterceptor');
                Restangular.get = jasmine.createSpy('get').andReturn(mixins.buildPromise({
                    data: {
                        id: 1,
                        name: "Mizoute",
                        summary: "A Cat"
                    }
                }));

                var formViewRepository = new FormViewRepository({}, Restangular, config);

                formViewRepository.getOne(view, 1)
                    .then(function () {
                        expect(Restangular.one).toHaveBeenCalledWith('cat', 1);
                        expect(Restangular.get).toHaveBeenCalledWith({key: 'abc'}, {pwd: '123456'});
                        expect(Restangular.addResponseInterceptor).toHaveBeenCalledWith(catInterceptor);
                    });
            });

            it('should POST an entity when calling createOne', function () {
                var formViewRepository = new FormViewRepository({}, Restangular, config),
                    rawEntity = {name: 'Mizu'};

                formViewRepository.createOne(view, rawEntity)
                    .then(function () {
                        expect(Restangular.restangularizeElement).toHaveBeenCalledWith(null, rawEntity, 'cat');
                        expect(Restangular.post).toHaveBeenCalledWith(null, rawEntity, null, {});
                    });
            });

            it('should PUT an entity when calling updateOne', function () {
                var formViewRepository = new FormViewRepository({}, Restangular, config),
                    rawEntity = {name: 'Mizu'};

                formViewRepository.updateOne(view, rawEntity)
                    .then(function () {
                        expect(Restangular.restangularizeElement).toHaveBeenCalledWith(null, rawEntity, 'cat');
                        expect(Restangular.put).toHaveBeenCalledWith(null, {});
                    });
            });

            it('should DELETE an entity when calling deleteone', function () {
                var formViewRepository = new FormViewRepository({}, Restangular, config);

                formViewRepository.deleteOne(view, 1)
                    .then(function () {
                        expect(Restangular.one).toHaveBeenCalledWith('cat', 1);
                        expect(Restangular.remove).toHaveBeenCalledWith(null, {});
                    });
            });
        });
    });
});
