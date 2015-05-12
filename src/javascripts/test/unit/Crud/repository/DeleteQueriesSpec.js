/*global define,jasmine,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var DeleteQueries = require('ng-admin/Crud/repository/DeleteQueries'),
        Field = require('ng-admin/es6/lib/Field/Field'),
        TextField = require('ng-admin/es6/lib/Field/TextField'),
        Entity = require('ng-admin/es6/lib/Entity/Entity'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        config,
        entity,
        view;

    describe("Service: DeleteQueries", function () {

        beforeEach(function () {
            config = function () {
                return {
                    baseApiUrl: angular.noop,
                    getQueryParamsFor: function () {
                        return null;
                    },
                    getRouteFor: function (entity, viewUrl, viewType, identifierValue) {
                        return 'http://localhost/' + entity.name() + (identifierValue ? '/' + identifierValue : '');
                    }
                };
            };

            entity = new Entity('cat').identifier(new Field('id'));
            view = entity.creationView()
                .addField(new TextField('name'));
        });

        describe("deleteOne", function () {
            it('should DELETE an entity when calling deleteone', function (done) {
                var deleteQueries = new DeleteQueries({}, Restangular, config);
                spyOn(Restangular, 'oneUrl').and.callThrough();
                spyOn(Restangular, 'customDELETE').and.callThrough();

                deleteQueries.deleteOne(view, 1)
                    .then(function () {
                        expect(Restangular.oneUrl).toHaveBeenCalledWith('cat', 'http://localhost/cat/1');
                        expect(Restangular.customDELETE).toHaveBeenCalledWith();
                    })
                    .then(done, done.fail);
            });
        });

        describe("batchDelete", function () {
            it('should DELETE entities when calling batchEntities', function () {
                var deleteQueries = new DeleteQueries({all: function (promises) {
                    return promises;
                }}, Restangular, config);
                spyOn(Restangular, 'oneUrl').and.callThrough();
                spyOn(Restangular, 'customDELETE').and.callThrough();

                var promises = deleteQueries.batchDelete(view, [1, 2]);
                expect(promises.length).toBe(2);
                expect(Restangular.oneUrl).toHaveBeenCalledWith('cat', 'http://localhost/cat/1');
                expect(Restangular.oneUrl).toHaveBeenCalledWith('cat', 'http://localhost/cat/2');
                expect(Restangular.customDELETE).toHaveBeenCalledWith();
                expect(Restangular.customDELETE).toHaveBeenCalledWith();
            });
        });
    });
});
