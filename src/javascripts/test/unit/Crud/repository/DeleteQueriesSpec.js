/*global define,jasmine,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var DeleteQueries = require('ng-admin/Crud/repository/DeleteQueries'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
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
    });
});
