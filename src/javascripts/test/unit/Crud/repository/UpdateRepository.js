/*global define,jasmine,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var UpdateRepository = require('ng-admin/Crud/repository/FormViewRepository'),
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
            view = entity.creationView()
                .addField(new Field('id').identifier(true))
                .addField(new Field('name').type('text'))
                .extraParams(null)
                .interceptor(null);
        });

        describe("updateOne", function () {

            it('should PUT an entity when calling updateOne', function () {
                var updateRepository = new UpdateRepository({}, Restangular, config),
                    rawEntity = {name: 'Mizu'};

                Restangular.put = jasmine.createSpy('put').andReturn(mixins.buildPromise({data: rawEntity}));

                updateRepository.updateOne(view, rawEntity)
                    .then(function (entry) {
                        expect(Restangular.restangularizeElement).toHaveBeenCalledWith(null, rawEntity, 'cat');
                        expect(Restangular.put).toHaveBeenCalledWith(null, {});
                        expect(entry.values.name).toEqual('Mizu');
                    });
            });
        });
    });
});
