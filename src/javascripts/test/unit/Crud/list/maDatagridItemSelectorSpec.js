/*global angular,inject,describe,it,expect,beforeEach,module*/
describe('directive: ma-datagrid-item-selector', function () {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/list/maDatagridItemSelector'),
        Entry = require('admin-config/lib/Entry'),
        $compile,
        scope,
        directiveUsage = '<ma-datagrid-item-selector entry="entry" selection="selection"></ma-datagrid-item-selector>'
    ;

    angular.module('testapp_DatagridItemSelector', [])
        .directive('maDatagridItemSelector', directive);

    beforeEach(angular.mock.module('testapp_DatagridItemSelector'));

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

    it('should become checked if entry is removed from selection', function () {
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].checked).toBe(false);
        scope.selection = scope.selection.concat(scope.entry);
        scope.$digest();
        expect(element.children()[0].checked).toBe(true);
    });

    it('should become unchecked if entry is added to selection', function () {
        scope.selection = scope.selection.concat(scope.entry);
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].checked).toBe(true);
        scope.selection = [];
        scope.$digest();
        expect(element.children()[0].checked).toBe(false);
    });

});
