/*global describe,it,expect,beforeEach*/
describe('controller: ma-datagrid', function () {
    var DataGridController = require('../../../../ng-admin/Crud/list/maDatagridController'),
        Entity = require('admin-config/lib/Entity/Entity'),
        Entry = require('admin-config/lib/Entry');

    var dataGridController, entries;

    beforeEach(function () {
        entries = [
            new Entry('my_entity', {value: 1}, 1),
            new Entry('my_entity', {value: 2}, 2),
            new Entry('my_entity', {value: 3}, 3)
        ];

        dataGridController = new DataGridController({
            listActions: () => [],
            entity: () => new Entity('my_entity'),
            entries: entries,
            selection: [],
            datastore: () => { return {}; }
        }, {
            search: () => {
                return {};
            }
        }, {});
    });

    describe('toggleSelect', function () {

        it('should add entry in selection if it was not in it', function () {
            dataGridController.toggleSelect(entries[0]);
            expect(dataGridController.$scope.selection).toEqual([entries[0]]);
        });

        it('should remove entry from selection if it was in it', function () {
            dataGridController.$scope.selection = entries;
            dataGridController.toggleSelect(entries[0]);
            expect(dataGridController.$scope.selection).toEqual([entries[1], entries[2]]);
        });

    });

    describe('toggleSelectAll', function () {
        it('should empty selection if it was full', function () {
            dataGridController.$scope.selection = entries;
            dataGridController.toggleSelectAll();
            expect(dataGridController.$scope.selection).toEqual([]);
        });

        it('should add all entries if selection was empty', function () {
            dataGridController.$scope.selection = [entries];
            dataGridController.toggleSelectAll();
            expect(dataGridController.$scope.selection).toEqual(entries);
        });

        it('should select all entries if selection was incomplete', function () {
            dataGridController.$scope.selection = [entries[0]];
            dataGridController.toggleSelectAll();
            expect(dataGridController.$scope.selection).toEqual(entries);
        });
    });
});
