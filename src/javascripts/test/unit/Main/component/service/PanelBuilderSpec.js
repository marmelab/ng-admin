/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var PanelBuilder = require('ng-admin/Main/component/service/PanelBuilder'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        DashboardView = require('ng-admin/Main/component/service/config/view/DashboardView'),
        mixins = require('mixins');

    describe("PanelBuilder", function () {

        describe('getPanelsData', function() {

            it('should retrieve panels', function (done) {
                var view1 = new DashboardView('view1')
                        .title('dashboard1')
                        .addField(new Field('title').label('Title')),
                    view2 = new DashboardView('MyView2')
                        .title('my dashboard 2')
                        .addField(new Field('name').label('Name'));

                var responses = [
                    {
                        view: view1,
                        entries: [],
                        currentPage: 1,
                        perPage: 10,
                        totalItems: 12
                    },
                    {
                        view: view2,
                        entries: [],
                        currentPage: 1,
                        perPage: 10,
                        totalItems: 4
                    }
                ];

                var q = { all: function() { return mixins.buildPromise(responses); } };
                var filter = function() { return function(a) { return a; }};
                var Configuration = function() { return { getViewsOfType: function() { return [view1, view2]; }} };
                var location = { search: function() { return {}; }};
                var retrieveQueries = { getAll: function() {} };
                var panelBuilder = new PanelBuilder(q, filter, location, retrieveQueries, Configuration);
                panelBuilder.getPanelsData().then(function(panels) {
                    // Check that panels are retrieved
                    expect(panels[0].label).toEqual('dashboard1');
                    expect(panels[1].label).toEqual('my dashboard 2');

                    expect(Object.keys(panels[1].fields).length).toEqual(1);
                    expect(panels[1].fields['name'].label()).toEqual('Name');
                    expect(panels[1].fields['name'].name()).toEqual('name');
                })
                .finally(done);
                
            });

        });

    });

});
