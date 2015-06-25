/*global angular,inject,describe,it,expect,beforeEach,module*/
describe('directive: ma-datagrid', function () {
    var directive = require('../../../../ng-admin/Crud/list/maDatagrid'),
        Entity = require('admin-config/lib/Entity/Entity'),
        Entry = require('admin-config/lib/Entry'),
        Field = require('admin-config/lib/Field/Field'),
        TextField = require('admin-config/lib/Field/TextField'),
        $compile,
        scope,
        directiveUsage = '<ma-datagrid name="{{ name }}" entries="entries" fields="fields" list-actions="listActions"' +
            'entity="entity" next-page="nextPage" per-page="itemsPerPage" total-items="{{ totalItems }}" infinite-pagination="infinitePagination">' +
            '</ma-datagrid>';

    angular.module('testapp_stateParams', [])
        .service('$stateParams', function($q){ return {}; });

    angular.module('testapp_Datagrid', ['testapp_stateParams'])
        .directive('maDatagrid', directive);

    beforeEach(angular.mock.module('testapp_Datagrid'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
        scope.name = 'my-view';
        scope.entries = [];
        scope.fields = [];
        scope.listActions = [];
        scope.entity = new Entity();
        scope.nextPage = angular.noop;
        scope.itemsPerPage = 10;
        scope.totalItems = 30;
        scope.infinitePagination = false;
    }));

    it("should contain a table tag", function () {
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.children()[0].nodeName).toBe('TABLE');
    });

    it("should add list actions", function () {
        scope.fields = [new Field('title')];
        scope.listActions = ['edit'];
        scope.entries = [new Entry()];

        var element = $compile(directiveUsage)(scope);

        scope.$digest();

        expect(element[0].querySelector('thead th:nth-child(2)').innerHTML).toContain('Actions');
        expect(element[0].querySelector('tbody tr td:nth-child(2) ma-list-actions').nodeName).toContain('MA-LIST-ACTIONS');
    });


    it("should add columns", function () {
        var entry1 = new Entry('cat'),
            element;

        entry1.values.title = 'Small cat';
        scope.fields = [new TextField('title')];
        scope.entries = [entry1];

        element  = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element[0].querySelector('tbody tr td:nth-child(1) ma-column').nodeName).toContain('MA-COLUMN');
    });
});
