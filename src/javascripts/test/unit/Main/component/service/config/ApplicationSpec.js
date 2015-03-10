/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var Application = require('ng-admin/es6/lib/Application'),
        Entity = require('ng-admin/es6/lib/Entity/Entity'),
        DashboardView = require('ng-admin/es6/lib/View/DashboardView'),
        CreateView = require('ng-admin/es6/lib/View/CreateView');

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
            it('should return the url specified in a view', function () {
                var app = new Application(),
                    entity1 = new Entity('myEntity1');

                entity1.dashboardView().url('http://localhost/dashboard');
                app.addEntity(entity1);

                expect(app.getRouteFor(entity1.dashboardView())).toBe('http://localhost/dashboard');
            });

            it('should not consider protocol relative URL as a relative path', function () {
                var app = new Application(),
                    entity1 = new Entity('myEntity1');

                entity1.dashboardView().url('//localhost/dashboard');
                app.addEntity(entity1);

                expect(app.getRouteFor(entity1.dashboardView())).toBe('//localhost/dashboard');
            });

            it('should return the url specified in the entity when the URL is not specified in the view', function () {
                var app = new Application(),
                    entity1 = new Entity('comments');

                entity1.baseApiUrl('http://api.com/');
                app.addEntity(entity1);

                expect(app.getRouteFor(entity1.dashboardView())).toBe('http://api.com/comments');
            });

            it('should return the url specified in the entity when the app also define a base URL', function () {
                var app = new Application(),
                    entity1 = new Entity('comments');

                entity1.baseApiUrl('//api.com/');
                app.baseApiUrl('http://api-entity.com/');
                app.addEntity(entity1);

                expect(app.getRouteFor(entity1.dashboardView())).toBe('//api.com/comments');
            });

            it('should return the url specified in the app when the URL is not specified in the view nor in the entity', function () {
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

                expect(app.getRouteFor(entity1.editionView(), 1)).toBe('http://api.local/comments_EditView/:1');
            });

            it('should not prepend baseApiUrl when the URL begins with http', function () {
                var app = new Application(),
                    entity1 = new Entity('comments');

                app.baseApiUrl('http://api.local');

                entity1.url('http://mock.local/entity');

                expect(app.getRouteFor(entity1.editionView(), 1)).toBe('http://mock.local/entity');
            });
        });

        describe('getErrorMessageFor', function () {
            it('should return the global message with a simple string as body', function () {
                var app = new Application(),
                    entity = new Entity(),
                    response = {
                        status: 500,
                        data: 'myBody'
                    };

                app.addEntity(entity);

                expect(app.getErrorMessageFor(entity.creationView(), response)).toBe('Oops, an error occured : (code: 500) myBody');
            });

            it('should return the global message with an object as body', function () {
                var app = new Application(),
                    entity = new Entity(),
                    response = {
                        status: 500,
                        data: {
                            error: 'Internal error'
                        }
                    };

                app.addEntity(entity);

                expect(app.getErrorMessageFor(entity.listView(), response)).toBe('Oops, an error occured : (code: 500) {"error":"Internal error"}');
            });

            it('should return the error message defined globally', function () {
                var app = new Application(),
                    entity = new Entity(),
                    response = {
                        status: 500
                    };

                app.errorMessage(function (response) {
                    return 'Global error: ' + response.status;
                });

                app.addEntity(entity);

                expect(app.getErrorMessageFor(entity.listView(), response)).toBe('Global error: 500');
            });

            it('should return the message defined by the entity', function () {
                var app = new Application(),
                    entity = new Entity(),
                    response = {
                        status: 500,
                        data: {
                            error: 'Internal error'
                        }
                    };

                entity.errorMessage(function (response) {
                    return 'error: ' + response.status;
                });

                app.addEntity(entity);

                expect(app.getErrorMessageFor(entity.listView(), response)).toBe('error: 500');
            });

            it('should return the message defined by the view', function () {
                var app = new Application(),
                    entity = new Entity(),
                    response = {
                        status: 500,
                        data: {
                            error: 'Internal error'
                        }
                    };

                entity.listView().errorMessage(function (response) {
                    return 'Error during listing: ' + response.status;
                });

                app.addEntity(entity);

                expect(app.getErrorMessageFor(entity.listView(), response)).toBe('Error during listing: 500');
            });
        });

    });
});
