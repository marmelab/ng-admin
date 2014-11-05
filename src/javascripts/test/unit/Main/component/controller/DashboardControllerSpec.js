/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var DashboardController = require('ng-admin/Main/component/controller/DashboardController'),
        PanelBuilder = require('ng-admin/Main/component/service/PanelBuilder'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        DashboardView = require('ng-admin/Main/component/service/config/view/DashboardView'),
        mixins = require('mixins');

    describe("Controller: Dashboard", function () {

        it('should retrieve panels', function () {
            var view1 = new DashboardView('view1')
                    .label('dashboard1')
                    .addField(new Field('title').label('Title')),
                view2 = new DashboardView('MyView2')
                    .label('my dashboard 2')
                    .addField(new Field('name').label('Name')),
                view1Copy = angular.copy(view1),
                view2Copy = angular.copy(view2);

            view1Copy.getField('title').value('abc');
            view2Copy.getField('name').value('My title');

            var responses = [
                {
                    view: view1,
                    entities: [view1Copy],
                    currentPage: 1,
                    perPage: 10,
                    totalItems: 12
                },
                {
                    view: view2,
                    entities: [view2Copy],
                    currentPage: 1,
                    perPage: 10,
                    totalItems: 4
                }
            ];

            var panelBuilder = new PanelBuilder(null, null, null, angular.noop);
            panelBuilder.getPanelsData = jasmine.createSpy('getPanelsData').andReturn(mixins.buildPromise(responses));

            var controller = new DashboardController({$on: angular.noop}, {}, panelBuilder);

            // Check that panels are retrieved
            expect(controller.panels[0].label).toEqual('dashboard1');
            expect(controller.panels[1].label).toEqual('my dashboard 2');

            expect(controller.panels[1].columns.length).toEqual(1);
            expect(controller.panels[1].columns[0].label).toEqual('Name');
            expect(controller.panels[1].columns[0].field.name()).toEqual('name');
        });

    });
});
