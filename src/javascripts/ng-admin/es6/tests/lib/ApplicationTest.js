var assert = require('chai').assert;

import Application from "../../lib/Application";
import Entity from "../../lib/Entity/Entity";

describe('Application', function() {
    describe('getViewsOfType', function() {
        it('should return empty array if no entity set', function() {
            var application = new Application();
            assert.equal(0, application.getViewsOfType('dashboard').length);
        });

        it('should return only views of type', function() {
            var application = new Application();
            application
                .addEntity(new Entity('post'))
                .addEntity(new Entity('comment'));

            var views = application.getViewsOfType('DashboardView');
            assert.equal(2, views.length);

            assert.equal('post', views[0].entity.name());
            assert.equal('DashboardView', views[0].type);

            assert.equal('comment', views[1].entity.name());
            assert.equal('DashboardView', views[1].type);
        });
    });

    describe('layout', function() {
        it('using function without argument should be as getter', function() {
            var application = new Application();
            application.layout = "New layout";

            assert.equal("New layout", application.layout);
        })
    });

    describe('buildMenuFromEntities', () => {
        it('should create a menu based on the entity list', () => {
            let application = new Application();
            application
                .addEntity(new Entity('post'))
                .addEntity(new Entity('comment'));
            let menu = application.buildMenuFromEntities();
            assert.equal(2, menu.children().length);
            let [menu1, menu2] = menu.children();
            assert.equal('Post', menu1.title());
            assert.equal('Comment', menu2.title());
        });
        it('should use the entity order when provided', () => {
            let application = new Application();
            application
                .addEntity(new Entity('p1').order(2))
                .addEntity(new Entity('p2').order(1))
                .addEntity(new Entity('p3').order(3));
            let menu = application.buildMenuFromEntities();
            let [menu1, menu2, menu3] = menu.children();
            assert.equal('P2', menu1.title());
            assert.equal('P1', menu2.title());
            assert.equal('P3', menu3.title());
        });
    })
});
