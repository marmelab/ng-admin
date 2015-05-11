/*global define,jasmine,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var WriteQueries = require('ng-admin/Crud/repository/WriteQueries'),
        Field = require('ng-admin/es6/lib/Field/Field'),
        TextField = require('ng-admin/es6/lib/Field/TextField'),
        Entity = require('ng-admin/es6/lib/Entity/Entity'),
        DataStore = require('ng-admin/es6/lib/DataStore/DataStore'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        config,
        entity,
        view;

    describe("Service: WriteQueries", function () {

        beforeEach(function () {
            config = function () {
                return {
                    baseApiUrl: angular.noop,
                    getQueryParamsFor: function () {
                        return null;
                    },
                    getRouteFor: function (entity, viewUrl, viewType, identyId) {
                        return 'http://localhost/' + entity.name() + (identyId ? '/' + identyId : '');
                    }
                };
            };

            entity = new Entity('cat').identifier(new Field('id'));
            view = entity.creationView()
                .addField(new TextField('name'));
        });

        describe("updateOne", function () {

            it('should PUT an entity when calling updateOne', function (done) {
                var WriteQueries = new WriteQueries({}, Restangular, config),
                    rawEntity = {id: 3, name: 'Mizu'};

                spyOn(Restangular, 'oneUrl').and.callThrough();
                spyOn(Restangular, 'customPUT').and.returnValue(mixins.buildPromise({data: rawEntity}));

                WriteQueries.updateOne(view, rawEntity)
                    .then(function (rawEntry) {
                        expect(Restangular.oneUrl).toHaveBeenCalledWith('cat', 'http://localhost/cat/3');
                        expect(Restangular.customPUT).toHaveBeenCalledWith(rawEntity);

                        var dataStore = new DataStore();
                        var entry = dataStore.mapEntry(entity.name(), view.identifier(), view.getFields(), rawEntry);
                        expect(entry.values.name).toEqual('Mizu');
                    })
                    .then(done, done.fail);
            });
        });
    });
});
