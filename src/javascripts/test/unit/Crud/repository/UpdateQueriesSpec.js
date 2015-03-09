/*global define,jasmine,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var UpdateQueries = require('ng-admin/Crud/repository/UpdateQueries'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        config,
        entity,
        view;

    describe("Service: UpdateQueries", function () {

        beforeEach(function () {
            config = function () {
                return {
                    baseApiUrl: angular.noop,
                    getQueryParamsFor: function () {
                        return null;
                    },
                    getRouteFor: function (view, identyId) {
                        return 'http://localhost/' + view.getEntity().name() + (identyId ? '/' + identyId : '');
                    }
                };
            };

            entity = new Entity('cat');
            view = entity.creationView()
                .addField(new Field('id').identifier(true))
                .addField(new Field('name').type('text'));
        });

        describe("updateOne", function () {

            it('should use default PUT method entity when calling updateOne', function (done) {
                var updateQueries = new UpdateQueries({}, Restangular, config),
                    rawEntity = {id: 3, name: 'Mizu'};

                spyOn(Restangular, 'oneUrl').and.callThrough();
                spyOn(Restangular, 'customPUT').and.returnValue(mixins.buildPromise({data: rawEntity}));

                updateQueries.updateOne(view, rawEntity)
                    .then(function (entry) {
                        expect(Restangular.oneUrl).toHaveBeenCalledWith('cat', 'http://localhost/cat/3');
                        expect(Restangular.customPUT).toHaveBeenCalledWith(rawEntity);
                        expect(entry.values.name).toEqual('Mizu');
                    })
                    .then(done, done.fail);
            });
        });
    });
});
