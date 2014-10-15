/*global require,describe,module,beforeEach,inject,it,expect*/

define(function(require) {
    'use strict';

    var Application = require('ng-admin/Main/component/service/config/Application'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        DashboardView = require('ng-admin/Main/component/service/config/view/DashboardView'),
        FormView = require('ng-admin/Main/component/service/config/view/FormView');

    describe("Service: Entity config", function() {

        describe('views', function() {
            it('should store views by name.', function() {
                var entity = new Entity('myEntity1'),
                    dashboard = new DashboardView('dashboard'),
                    formView = new FormView('form1');

                entity.addView(dashboard)
                    .addView(formView);

                expect(Object.keys(entity.getViews()).length).toBe(2);
                expect(entity.getView('dashboard').name()).toBe('dashboard');
                expect(entity.getView('form1').getEntity().name()).toBe('myEntity1');
            });

            it('should retrieve views by type.', function() {
                var entity = new Entity('myEntity1'),
                    dashboard = new DashboardView('dashboard'),
                    formView = new FormView('form1');

                entity.addView(dashboard)
                    .addView(formView);

                expect(entity.getViewsOfType('DashboardView')[0].name()).toBe('dashboard');
                expect(entity.getViewsOfType('FormView')[0].name()).toBe('form1');
                expect(entity.getViewsOfType('MyType').length).toBe(0);
            });

        });

    });
});
