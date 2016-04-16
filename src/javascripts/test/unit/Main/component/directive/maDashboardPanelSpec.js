/*global angular,inject,describe,it,expect,beforeEach,module*/
describe('directive: ma-dashboard-panel', function () {
    'use strict';

    var directive = require('../../../../../ng-admin/Main/component/directive/maDashboardPanel'),
        Entity = require('admin-config/lib/Entity/Entity'),
        $compile,
        scope,
        directiveUsage = '<ma-dashboard-panel collection="collection" entries="entries"></ma-dashboard-panel>';

    angular.module('testapp_state', [])
        .filter('translate', () => text => text)
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
    }));

    it("should display a title with a datagrid", function () {
        scope.collection = {
            title: () => 'Comments',
            name: () => 'myView',
            fields: () => [],
            entity: new Entity(),
            listActions: () => {}
        };
        scope.entries = [];
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element[0].querySelector('.panel-heading').innerHTML).toContain('Comments');
        expect(element[0].querySelector('ma-datagrid').getAttribute('name')).toBe('myView');
    });
});
