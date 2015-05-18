/*global jasmine,angular,describe,it,expect*/
var PanelBuilder = require('../../../../../ng-admin/Main/component/service/PanelBuilder'),
    Field = require('../../../../../ng-admin/es6/lib/Field/Field'),
    DashboardView = require('../../../../../ng-admin/es6/lib/View/DashboardView'),
    Entity = require('../../../../../ng-admin/es6/lib/Entity/Entity'),
    DataStore = require('../../../../../ng-admin/es6/lib/DataStore/DataStore'),
    mixins = require('../../../../mock/mixins');

describe("PanelBuilder", function () {
    'use strict';

    describe('getPanelsData', function() {

        it('should retrieve panels', function (done) {
            var entity = new Entity(),
                view1 = new DashboardView('view1')
                    .title('dashboard1')
                    .setEntity(entity)
                    .addField(new Field('title').label('Title')),
                view2 = new DashboardView('MyView2')
                    .title('my dashboard 2')
                    .setEntity(entity)
                    .addField(new Field('name').label('Name'));

            var responses = [
                {
                    view: view1,
                    data: [],
                    currentPage: 1,
                    perPage: 10,
                    totalItems: 12
                },
                {
                    view: view2,
                    data: [],
                    currentPage: 1,
                    perPage: 10,
                    totalItems: 4
                }
            ];

            var panelBuilder = getPanelBuilder([view1, view2], responses);
            panelBuilder.getPanelsData().then(function(panels) {
                // Check that panels are retrieved
                expect(panels[0].label).toEqual('dashboard1');
                expect(panels[1].label).toEqual('my dashboard 2');

                expect(Object.keys(panels[1].fields).length).toEqual(1);
                expect(panels[1].fields[0].label()).toEqual('Name');
                expect(panels[1].fields[0].name()).toEqual('name');
            })
            .finally(done);

        });

        it('should default to entity label if no title is provided', function(done) {
            var dashboardView = new DashboardView('view1').addField(new Field('title').label('Title'));
            dashboardView.setEntity(new Entity('MyEntity'));

            var response = {
                view: dashboardView,
                data: [],
                currentPage: 1,
                perPage: 10,
                totalItems: 12
            };

            var panelBuilder = getPanelBuilder([dashboardView], [response]);
            panelBuilder.getPanelsData()
                .then(function(panels) {
                    expect(panels[0].label).toBe('MyEntity');
                })
                .finally(done);
        });
    });
});

function getPanelBuilder(dashboardViews, responses) {
    var q = { all: function() { return mixins.buildPromise(responses); } };
    var Configuration = function() {
        return {
            getViewsOfType: function() {
                return dashboardViews;
            }
        };
    };
    var location = { search: function() { return {}; } };
    var retrieveQueries = { getAll: function() {} };
    var AdminDescription = { getDataStore: function() { return new DataStore(); } };

    return new PanelBuilder(q, location, retrieveQueries, Configuration, AdminDescription);
}
