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

        describe('getRouteFor', function () {
            it('should returns the url specified in a view', function () {
                var app = new Application(),
                    entity1 = new Entity('myEntity1');

                entity1.dashboardView().url('http://localhost/dashboard');
                app.addEntity(entity1);

                expect(app.getRouteFor(entity1.dashboardView())).toBe('http://localhost/dashboard');
            });

            it('should returns the url specified in the entity when the URL is not specified in the view', function () {
                var app = new Application(),
                    entity1 = new Entity('comments');

                entity1.baseURL('http://api.com/');
                app.addEntity(entity1);

                expect(app.getRouteFor(entity1.dashboardView())).toBe('http://api.com/comments');
            });

            it('should returns the url specified in the app when the URL is not specified in the view nor in the entity', function () {
                var app = new Application(),
                    entity1 = new Entity('comments');

                app.baseApiUrl('https://elastic.local/');
                app.addEntity(entity1);

                expect(app.getRouteFor(entity1.dashboardView())).toBe('https://elastic.local/comments');
            });

            it('should call url() defined in the view if it\'s a function', function () {
                var app = new Application(),
                    entity1 = new Entity('comments');

                app.baseApiUrl('http://api.local');

                entity1.editionView().url(function (entityId) {
                    return '/post/:' + entityId;
                });

                expect(app.getRouteFor(entity1.editionView(), 1)).toBe('http://api.local/post/:1');
            });

            it('should call url() defined in the entity if it\'s a function', function () {
                var app = new Application(),
                    entity1 = new Entity('comments');

                app.baseApiUrl('http://api.local');

                entity1.url(function (view, entityId) {
                    return '/' + view.name() + '/:' + entityId;
                });

                expect(app.getRouteFor(entity1.editionView(), 1)).toBe('http://api.local/myView/:1');
            });

            it('should not prepend baseURL when the URL begins with http', function () {
                var app = new Application(),
                    entity1 = new Entity('comments');

                app.baseApiUrl('http://api.local');

                entity1.url('http://mock.local/entity');

                expect(app.getRouteFor(entity1.editionView(), 1)).toBe('http://mock.local/entity');
            });
        });

        describe('getQueryParamsFor', function () {
            it('should retrieve params from the view', function () {
                var app = new Application(),
                    entity1 = new Entity('myEntity1');

                entity1.dashboardView().transformParams(function (params) {
                    params._sort = 'viewTitle';
                    return params;
                });

                entity1.transformParams(function (params) {
                    params._sort = 'entityTitle';
                    return params;
                });


                expect(app.getQueryParamsFor(entity1.dashboardView())).toEqual({_sort: 'viewTitle'});
            });

            it('should retrieve params from the entity', function () {
                var app = new Application(),
                    entity1 = new Entity('myEntity1');

                app.transformParams(function (params) {
                    params._sort = 'appTitle';
                    return params;
                });

                entity1.transformParams(function (params) {
                    params._sort = 'entityTitle';
                    return params;
                });

                expect(app.getQueryParamsFor(entity1.dashboardView())).toEqual({_sort: 'entityTitle'});
            });

            it('should retrieve params from the application', function () {
                var app = new Application(),
                    entity1 = new Entity('myEntity1');

                app.transformParams(function (params) {
                    params._sort = 'appTitle';
                    return params;
                });

                expect(app.getQueryParamsFor(entity1.dashboardView())).toEqual({_sort: 'appTitle'});
            });
        });

    });
});
