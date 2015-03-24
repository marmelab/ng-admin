/*global define,angular,inject,describe,it,expect,beforeEach,module*/

define(function (require) {
    'use strict';

    describe('directive: ma-datagrid-item-selector', function () {
        var directive = require('ng-admin/Crud/list/maDatagridItemSelector'),
            Entry = require('ng-admin/es6/lib/Entry'),
            $compile,
            scope,
            directiveUsage = '<ma-datagrid-item-selector entry="entry" selection="selection"></ma-datagrid-item-selector>'
        ;

        angular.module('testapp_DatagridItemSelector', [])
            .directive('maDatagridItemSelector', directive);
        require('angular-mocks');

        beforeEach(module('testapp_DatagridItemSelector'));

        beforeEach(inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            scope = _$rootScope_;
            scope.entry = new Entry('entity', {some: 'values'}, 'entity_1');
            scope.selection = [new Entry('entity', {some: 'values'}, 'entity_2'), new Entry('entity', {some: 'values'}, 'entity_3')];
        }));

        it('should be unchecked if entry is not in selection', function () {
            var element = $compile(directiveUsage)(scope);
            scope.$digest();

            expect(element.children()[0].checked).toBe(false);
        });

        it('should be checked if entry is in selection', function () {
            scope.selection.push(scope.entry);
            var element = $compile(directiveUsage)(scope);
            scope.$digest();

            expect(element.children()[0].checked).toBe(true);
        });

        it('should add unselected entry to selection on click', function () {
            var element = $compile(directiveUsage)(scope);
            scope.$digest();

            element.find('input').triggerHandler('click');

            expect(element.children()[0].checked).toBe(true);
            expect(scope.selection.length).toBe(3);
            expect(scope.selection.indexOf(scope.entry)).toBe(2);
        });

        it('should remove selected entry from selection on click', function () {
            scope.selection.push(scope.entry);

            var element = $compile(directiveUsage)(scope);
            scope.$digest();

            element.find('input').triggerHandler('click');

            expect(element.children()[0].checked).toBe(false);
            expect(scope.selection.length).toBe(2);
            expect(scope.selection.indexOf(scope.entry)).toBe(-1);
        });

    });
});
