/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var Entity = require('ng-admin/Main/component/service/config/Entity'),
        DashboardView = require('ng-admin/Main/component/service/config/view/DashboardView'),
        CreateView = require('ng-admin/Main/component/service/config/view/CreateView');

    describe("Service: Entity config", function () {

        describe('getViewByType', function () {

            it('should retrieve a view by type', function () {
                var entity = new Entity('myEntity1');
                expect(entity.getViewByType('DashboardView').constructor.name).toBe('DashboardView');
                expect(entity.getViewByType('CreateView').constructor.name).toBe('CreateView');
            });

        });

    });
});
