/*global require,describe,module,beforeEach,inject,it,expect*/

define(function(require) {
    'use strict';

    var FormViewRepository = require('ng-admin/Crud/component/service/FormViewRepository'),
        FormView = require('ng-admin/Main/component/service/config/view/FormView'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        config,
        entity,
        view;

    describe("Service: FormViewRepository", function() {

        beforeEach(function() {
            config = function() {
                return {
                    baseApiUrl: angular.noop
                };
            };

            entity = new Entity('cat');
            view = new FormView('myFormView')
                .addField(new Field('id').identifier(true))
                .addField(new Field('name').type('text'));

            view.getField('id').value = 1;
            entity.addView(view);

            view.extraParams(null);
            view.interceptor(null);
        });

        describe("getOne", function() {


            it('should return an the entity with only the editable fields.', function () {
                Restangular.get = jasmine.createSpy('get').andReturn(mixins.buildPromise({
                    data: {
                        "id": 1,
                        "name": "Mizoute",
                        "summary": "A Cat"
                    }
                }));

                var formViewRepository = new FormViewRepository({}, Restangular, config);

                formViewRepository.getOne(view, 1)
                    .then(function (viewResult) {
                        expect(Restangular.one).toHaveBeenCalledWith('cat', 1);
                        expect(viewResult.getField('id').value).toBe(1);
                        expect(viewResult.getField('name').value).toBe('Mizoute');

                        // Non mapped field should not be retrieved
                        expect(viewResult.getField('summary')).toBe(undefined);
                    });
            });

            it('should add response interceptor, extra params & headers.', function () {
                var catInterceptor;
                view.interceptor(catInterceptor = function (data, operation, what, url, response, deferred) {
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

                var config = function () {
                    return {
                        baseApiUrl: angular.noop
                    };
                };

                var formViewRepository = new FormViewRepository({}, Restangular, config);

                formViewRepository.getOne(view, 1)
                    .then(function () {
                        expect(Restangular.one).toHaveBeenCalledWith('cat', 1);
                        expect(Restangular.get).toHaveBeenCalledWith({key: 'abc'}, {pwd: '123456'});
                        expect(Restangular.addResponseInterceptor).toHaveBeenCalledWith(catInterceptor);
                    });
            });
        });
    });
});
