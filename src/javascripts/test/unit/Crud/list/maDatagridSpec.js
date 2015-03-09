/*global define,angular,inject,describe,it,expect,beforeEach,module*/

define(function (require) {
    'use strict';

    describe('directive: ma-datagrid', function () {
        var directive = require('ng-admin/Crud/list/maDatagrid'),
            Entity = require('ng-admin/es6/lib/Entity/Entity'),
            Entry = require('ng-admin/es6/lib/Entry'),
            Field = require('ng-admin/es6/lib/Field/Field'),
            TextField = require('ng-admin/es6/lib/Field/TextField'),
            orderElement = require('ng-admin/Main/component/filter/OrderElement'),
            $compile,
            scope,
            directiveUsage = '<ma-datagrid name="{{ name }}" entries="entries" fields="fields" list-actions="listActions"' +
                'entity="entity" next-page="nextPage" per-page="itemsPerPage" total-items="{{ totalItems }}" infinite-pagination="infinitePagination">' +
                '</ma-datagrid>';

        angular.module('testapp_Datagrid', [])
            .filter('orderElement', orderElement)
            .directive('maDatagrid', directive);
        require('angular-mocks');

        beforeEach(module('testapp_Datagrid'));

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
            expect(element[0].querySelector('tbody tr td:nth-child(2) list-actions').nodeName).toContain('LIST-ACTIONS');
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
});
