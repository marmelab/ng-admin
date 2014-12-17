/*global define,angular,inject,describe,it,expect,beforeEach,module*/

define(function (require) {
    'use strict';

    require('angular-mocks');

    describe('directive: ma-datagrid', function () {
        var directive = require('ng-admin/Crud/filter/maQuickFilter'),
            $compile,
            scope,
            directiveUsage = '<ma-quick-filter quick-filters="quickFilters"></ma-quick-filter>';

        angular.module('testapp_QuickFilter', []).directive('maQuickFilter', directive);

        beforeEach(module('testapp_QuickFilter'));

        beforeEach(inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            scope = _$rootScope_;
            scope.quickFilters = [];
        }));

        it("should not display filter when no filters", function () {
            var element = $compile(directiveUsage)(scope);
            scope.$digest();

            expect(element[0].querySelector('ul')).toBeNull();
        });

        it("should not display filter when no filters", function () {
            var element = $compile(directiveUsage)(scope);

            scope.quickFilters = ['Today'];
            scope.$digest();

            expect(element[0].querySelector('li:nth-child(1)').innerHTML).toContain('Filters');
            expect(element[0].querySelector('li:nth-child(2) a').innerHTML).toContain('None');
            expect(element[0].querySelector('li:nth-child(3) a').innerHTML).toContain('Today');
        });
    });
});
