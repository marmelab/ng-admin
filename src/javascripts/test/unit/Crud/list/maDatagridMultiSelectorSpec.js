/*global angular,inject,describe,it,expect,beforeEach,module*/
describe('directive: ma-datagrid-multi-selector', function () {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/list/maDatagridMultiSelector'),
        Entry = require('admin-config/lib/Entry'),
        $compile,
        scope,
        directiveUsage = '<ma-datagrid-multi-selector entries="entries" selection="selection"></ma-datagrid-multi-selector>'
    ;

    angular.module('testapp_DatagridMultiSelector', [])
        .directive('maDatagridMultiSelector', directive);

    beforeEach(angular.mock.module('testapp_DatagridMultiSelector'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
        scope.entries = [new Entry('entity', {some: 'values'}, 'entity_1'), new Entry('entity', {some: 'values'}, 'entity_2'), new Entry('entity', {some: 'values'}, 'entity_3')];
        scope.selection = [new Entry('entity', {some: 'values'}, 'entity_2'), new Entry('entity', {some: 'values'}, 'entity_3')];
    }));

    it('checkbox should be indeterminate if entries does not correspond to selection', function () {
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(true);
        expect(element.children()[0].checked).toBe(false);
    });

    it('checkbox should be true if entries correspond to selection', function () {
        scope.selection = scope.entries;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(false);
        expect(element.children()[0].checked).toBe(true);
    });

    it('checkbox should be true if entries correspond to selection even if order differ', function () {
        scope.selection = [scope.entries[2], scope.entries[1], scope.entries[0]];
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(false);
        expect(element.children()[0].checked).toBe(true);
    });

    it('checkbox should be false if selection is empty', function () {
        scope.selection = [];
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(false);
        expect(element.children()[0].checked).toBe(false);
    });

    it('checkbox should become indeterminate once selection stop corresponding to entries', function () {
        scope.selection = scope.entries;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(false);
        expect(element.children()[0].checked).toBe(true);

        scope.selection = [scope.selection.pop()];
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(true);
        expect(element.children()[0].checked).toBe(false);
    });

    it('checkbox should become indeterminate once entries stop corresponding to selection', function () {
        scope.selection = scope.entries;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(false);
        expect(element.children()[0].checked).toBe(true);

        scope.entries = scope.entries.concat(new Entry('entity', {some: 'value'}, 'entity_4'));

        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(true);
        expect(element.children()[0].checked).toBe(false);
    });


    it('checkbox should become false once selection become empty', function () {
        scope.selection = scope.entries;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(false);
        expect(element.children()[0].checked).toBe(true);

        scope.selection = [];
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(false);
        expect(element.children()[0].checked).toBe(false);
    });

    it('checkbox should become true once entries correspond to selection', function () {
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(true);
        expect(element.children()[0].checked).toBe(false);

        scope.selection = scope.entries;
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(false);
        expect(element.children()[0].checked).toBe(true);
    });

    it('checkbox should be false if selection is empty', function () {
        scope.selection = [];
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].indeterminate).toBe(false);
        expect(element.children()[0].checked).toBe(false);
    });
});
