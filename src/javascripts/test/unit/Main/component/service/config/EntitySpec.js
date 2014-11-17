/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var Entity = require('ng-admin/Main/component/service/config/Entity'),
        DashboardView = require('ng-admin/Main/component/service/config/view/DashboardView'),
        CreateView = require('ng-admin/Main/component/service/config/view/CreateView');

    describe("Service: Entity config", function () {

        describe('getViewsByType', function () {

            it('should retrieve views by type.', function () {
                var entity = new Entity('myEntity1');

                expect(entity.getViewByType('DashboardView').isA('DashboardView'));
                expect(entity.getViewByType('CreateView').isA('CreateView'));
            });

        });

    });
});
