/*global define,jasmine,angular,describe,it,expect,beforeEach,spyOn*/

define(function (require) {
    'use strict';

    var CreateQueries = require('ng-admin/Crud/repository/CreateQueries'),
        Field = require('ng-admin/es6/lib/Field/Field'),
        TextField = require('ng-admin/es6/lib/Field/TextField'),
        Entity = require('ng-admin/es6/lib/Entity/Entity'),
        DataStore = require('ng-admin/es6/lib/DataStore/DataStore'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        config,
        entity,
        view;

    describe("Service: CreateQueries", function () {

        beforeEach(function () {
            config = function () {
                return {
                    baseApiUrl: angular.noop,
                    getQueryParamsFor: function () {
                        return null;
                    },
                    getRouteFor: function (entity) {
                        return 'http://localhost/' + entity.name();
                    }
                };
            };

            entity = new Entity('cat').identifier(new Field('id'));
            view = entity.creationView()
                .addField(new TextField('name'));
        });

        describe("createOne", function () {

            it('should POST an entity when calling createOne', function (done) {
                var createQueries = new CreateQueries({}, Restangular, config),
                    rawEntity = {name: 'Mizu'};

                spyOn(Restangular, 'customPOST').and.returnValue(mixins.buildPromise({data: rawEntity}));
                spyOn(Restangular, 'oneUrl').and.callThrough();

                createQueries.createOne(view, rawEntity)
                    .then(function (rawEntry) {
                        expect(Restangular.oneUrl).toHaveBeenCalledWith('cat', 'http://localhost/cat');
                        expect(Restangular.customPOST).toHaveBeenCalledWith(rawEntity);

                        var dataStore = new DataStore();
                        var entry = dataStore.mapEntry(entity.name(), view.identifier(), view.getFields(), rawEntry);
                        expect(entry.values.name).toEqual('Mizu');
                    })
                    .then(done, done.fail);
            });
        });
    });
});
