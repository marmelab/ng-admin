/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var Application = require('ng-admin/Main/component/service/config/Application'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        DashboardView = require('ng-admin/Main/component/service/config/view/DashboardView'),
        CreateView = require('ng-admin/Main/component/service/config/view/CreateView');

    describe("Service: Application config", function () {

        describe('entity', function () {
            it('should store entity by name.', function () {
                var app = new Application(),
                    entity = new Entity('myEntity');
                app.addEntity(entity);

                expect(app.getEntity('myEntity').name()).toBe('myEntity');
                expect(app.getEntity('myEntity').order()).toBe(0);
                expect(app.hasEntity('myEntity')).toBe(true);
            });

            it('should return all entity names.', function () {
                var app = new Application();
                app.addEntity(new Entity('myEntity1'));
                app.addEntity(new Entity('myEntity2'));

                expect(app.getEntityNames()).toEqual(['myEntity1', 'myEntity2']);
            });
        });

        describe('view', function () {
            it('should returns all view of a certain type.', function () {
                var app = new Application(),
                    entity1 = new Entity('myEntity1'),
                    entity2 = new Entity('myEntity2'),
                    dashboard = entity1.dashboardView(),
                    dashboard2 = entity2.dashboardView(),
                    createView = entity2.creationView();

                app.addEntity(entity1);
                app.addEntity(entity2);

                var dashboards = app.getViewsOfType('DashboardView'),
                    forms = app.getViewsOfType('CreateView'),
                    lists = app.getViewsOfType('ListView');

                expect(dashboards.length).toBe(2);
                expect(forms.length).toBe(2);
                expect(lists.length).toBe(2);

                expect(dashboards[0].getEntity().name()).toBe('myEntity1');
                expect(dashboards[1].getEntity().name()).toBe('myEntity2');
            });

        });

    });
});
