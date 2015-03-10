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
});
