/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var Entity = require('ng-admin/es6/lib/Entity/Entity'),
        DashboardView = require('ng-admin/es6/lib/View/DashboardView'),
        CreateView = require('ng-admin/es6/lib/View/CreateView');

    describe("Service: Entity config", function () {
        describe('readOnly', function() {
            it('should not be called by default', function() {
                var entity = new Entity();
                expect(entity.isReadOnly).toEqual(false);
            });
            it('should set isReadOnly to true', function() {
                var entity = new Entity().readOnly();
                expect(entity.isReadOnly).toEqual(true);
            });
            it('should disable mutation views', function() {
                var entity = new Entity().readOnly();
                expect(entity.editionView().isEnabled()).toEqual(false);
                expect(entity.creationView().isEnabled()).toEqual(false);
                expect(entity.deletionView().isEnabled()).toEqual(false);
            });
        })

    });
});
