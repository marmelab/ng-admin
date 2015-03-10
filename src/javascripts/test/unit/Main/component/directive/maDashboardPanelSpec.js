/*global define,angular,inject,describe,it,expect,beforeEach,module*/

define(function (require) {
    'use strict';

    require('angular-mocks');

    describe('directive: ma-dashboard-panel', function () {
        var directive = require('ng-admin/Main/component/directive/maDashboardPanel'),
            Entity = require('ng-admin/es6/lib/Entity/Entity'),
            $compile,
            scope,
            directiveUsage = '<ma-dashboard-panel label="{{ label }}" view-name="{{ viewName }}" fields="fields"' +
                ' entries="entries" entity="entity" per-page="perPage"></ma-dashboard-panel>';

        angular.module('testapp_DashboardPanel', []).directive('maDashboardPanel', directive);

        beforeEach(module('testapp_DashboardPanel'));

        beforeEach(inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            scope = _$rootScope_;
            scope.label = '';
            scope.viewName = '';
            scope.fields = [];
            scope.entries = [];
            scope.entity = new Entity();
            scope.perPage = 15;
        }));

        it("should display a title with a datagrid", function () {
            var element = $compile(directiveUsage)(scope);
            scope.label = 'Comments';
            scope.viewName = 'myView';
            scope.$digest();

            expect(element[0].querySelector('.panel-heading').innerHTML).toContain('Comments');
            expect(element[0].querySelector('ma-datagrid').getAttribute('name')).toBe('myView');
        });
    });
});
