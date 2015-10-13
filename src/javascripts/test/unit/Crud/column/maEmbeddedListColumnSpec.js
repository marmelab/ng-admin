/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: ma-embedded-list-column', function () {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/column/maEmbeddedListColumn');
    var Field = require('admin-config/lib/Field/Field');
    var EmbeddedListField = require('admin-config/lib/Field/EmbeddedListField');

    angular.module('testapp_EmbeddedListColumn', [])
        .directive('maEmbeddedListColumn', directive)
        .service('NgAdminConfiguration', () => () => ({}));

    var $compile,
        scope,
        directiveUsage = '<ma-embedded-list-column field="field" value="value" datastore="datastore"></ma-embedded-list-column>';

    beforeEach(angular.mock.module('testapp_EmbeddedListColumn'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it('should contain a datagrid', function () {
        scope.field = new EmbeddedListField()
            .targetFields([new Field('num'), new Field('name')]);
        scope.value = [{ num: 1, name: 'foo', dummy: 0 }, { num: 2, name: 'bar', dummy: 1 }];
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].nodeName).toBe('MA-DATAGRID');
        const datagridScope = angular.element(element.children()[0]).scope();
        expect(datagridScope.entries.length).toBe(2);
        expect(datagridScope.entries[0].values).toEqual({ num: 1, name: 'foo', dummy: 0 });
        expect(datagridScope.entries[1].values).toEqual({ num: 2, name: 'bar', dummy: 1 });
        expect(datagridScope.targetFields.length).toBe(2);
        expect(datagridScope.targetFields[0].name()).toBe('num');
        expect(datagridScope.targetFields[1].name()).toBe('name');
    });

    it('should sort the list according to the sortField', function () {
        scope.field = new EmbeddedListField()
            .targetFields([new Field('num'), new Field('name')])
            .sortField('num')
            .sortDir('DESC');
        scope.value = [{ num: 1, name: 'foo', dummy: 0 }, { num: 2, name: 'bar', dummy: 1 }];
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        const datagridScope = angular.element(element.children()[0]).scope();
        expect(datagridScope.entries.length).toBe(2);
        expect(datagridScope.entries[0].values).toEqual({ num: 2, name: 'bar', dummy: 1 });
        expect(datagridScope.entries[1].values).toEqual({ num: 1, name: 'foo', dummy: 0 });
        expect(datagridScope.sortField).toEqual('num');
        expect(datagridScope.sortDir).toEqual('DESC');
    });

    it('should filter the list according to the permanentFilters', function () {
        scope.field = new EmbeddedListField()
            .targetFields([new Field('num'), new Field('name')])
            .permanentFilters({ name: 'foo' });
        scope.value = [{ num: 1, name: 'foo', dummy: 0 }, { num: 2, name: 'bar', dummy: 1 }];
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        const datagridScope = angular.element(element.children()[0]).scope();
        expect(datagridScope.entries.length).toBe(1);
        expect(datagridScope.entries[0].values).toEqual({ num: 1, name: 'foo', dummy: 0 });
    });

});
