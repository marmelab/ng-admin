/*global require,describe,module,beforeEach,inject,it,expect*/

define(function (require) {
    'use strict';

    var ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Field = require('ng-admin/Main/component/service/config/Field');

    describe("Service: ListView config", function () {

        describe('listActions()', function () {
            it('should return the view', function () {
                var view = new ListView();
                expect(view.listActions(['edit'])).toBe(view);
            });

            it('should store the listActions for the Datagrid', function () {
                var view = new ListView();
                expect(view.listActions(['edit']).listActions()).toEqual(['edit']);
            });
        });

        describe('addQuickFilter()', function () {
            it('should store quickfilter by name', function () {
                var list = new ListView();

                list.addQuickFilter('Today', {'now': 1});

                expect(list.getQuickFilterNames()).toEqual(['Today']);
                expect(list.getQuickFilterParams('Today')).toEqual({'now': 1});
            });
        });

        describe('extraParams()', function () {
            it('should set extra params', function () {
                var list = new ListView('allCats');
                list
                    .setEntity(new Entity('cat'))
                    .perPage(10)
                    .extraParams(function () {
                        return { token: 'abcde1' };
                    })
                    .pagination(function (page, maxPerPage) {
                        return { begin: page, end: page * maxPerPage };
                    });

                var params = list.getAllParams(12, {params: {_sort: 'name'}}, {q: 'mizu'});

                expect(params.token).toEqual('abcde1');
                expect(params.begin).toEqual(12);
                expect(params.end).toEqual(120);
                expect(params._sort).toEqual('name');
                expect(params.q).toEqual('mizu');
            });
        });

        describe('map()', function () {
            it('should apply the function argument to all list values', function () {
                var list = new ListView('allCats');
                list
                    .setEntity(new Entity('cats'))
                    .addField(new Field('id').identifier(true))
                    .addField(new Field('name').map(function (value) {
                        return value.substr(0, 5) + '...';
                    }));

                var entries = list.mapEntries([
                    { id: 1, human_id: 1, name: 'Suna'},
                    { id: 2, human_id: 2, name: 'Boby'},
                    { id: 3, human_id: 1, name: 'Mizute'}
                ]);

                expect(entries[0].values.id).toEqual(1);
                expect(entries[0].values.name).toEqual('Suna...');
                expect(entries[2].values.id).toEqual(3);
                expect(entries[2].values.name).toEqual('Mizut...');
            });
        });

    });
});
