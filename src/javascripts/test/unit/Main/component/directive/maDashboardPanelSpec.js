/*global angular,inject,describe,it,expect,beforeEach,module*/
describe('directive: ma-dashboard-panel', function () {
    'use strict';

    var directive = require('../../../../../ng-admin/Main/component/directive/maDashboardPanel'),
        Entity = require('admin-config/lib/Entity/Entity'),
        $compile,
        scope,
        directiveUsage = '<ma-dashboard-panel label="{{ label }}" view-name="{{ viewName }}" fields="fields"' +
            ' entries="entries" entity="entity" per-page="perPage"></ma-dashboard-panel>';

    angular.module('testapp_state', [])
        .service('$state', function($q) {
            this.expectedTransitions = [];
            this.transitionTo = function(stateName){
                if (this.expectedTransitions.length > 0){
                    var expectedState = this.expectedTransitions.shift();
                    if (expectedState !== stateName){
                        throw Error('Expected transition to state: ' + expectedState + ' but transitioned to ' + stateName );
                    }
                } else {
                    throw Error('No more transitions were expected! Tried to transition to ' + stateName );
                }
                return $q.when();
            };
            this.go = this.transitionTo;
            this.expectTransitionTo = function(stateName){
                this.expectedTransitions.push(stateName);
            };

            this.ensureAllTransitionsHappened = function(){
                if (this.expectedTransitions.length > 0){
                    throw Error('Not all transitions happened!');
                }
            };
        });

    angular.module('testapp_DashboardPanel', ['testapp_state'])
        .directive('maDashboardPanel', directive);

    beforeEach(angular.mock.module('testapp_DashboardPanel'));

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
