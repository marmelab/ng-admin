/*global require,describe,module,beforeEach,inject,it,expect*/

define(function (require) {
    'use strict';

    var ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Field = require('ng-admin/Main/component/service/config/Field');

    describe("Service: ListView config", function () {

        it('should store quickfilter by name.', function () {
            var list = new ListView();

            list.addQuickFilter('Today', {'now': 1});

            expect(list.getQuickFilterNames()).toEqual(['Today']);
            expect(list.getQuickFilterParams('Today')).toEqual({'now': 1});
        });

        it('should returns extra params.', function () {
            var list = new ListView('allCats'),
                entity = new Entity('cat');

            list.perPage(10);
            list.extraParams(function () {
                return {token: 'abcde1'};
            });

            list.pagination(function (page, maxPerPage) {
                return {
                    begin: page,
                    end: page * maxPerPage
                };
            });

            entity.addView(list);

            var params = list.getAllParams(12, {params: {_sort: 'name'}}, 'mizu');

            expect(params.token).toEqual('abcde1');
            expect(params.begin).toEqual(12);
            expect(params.end).toEqual(120);
            expect(params._sort).toEqual('name');
            expect(params.q).toEqual('mizu');
        });

        it('should truncate list values.', function () {
            var list = new ListView('allCats'),
                entity = new Entity('cats');

            entity.addView(list);

            list.addField(new Field('id').identifier(true));
            list.addField(new Field('name').truncateList(function (value) {
                return value.substr(0, 5) + '...';
            }));

            var entries = list.truncateListValue(list.mapEntries([
                { id: 1, human_id: 1, name: 'Suna'},
                { id: 2, human_id: 2, name: 'Boby'},
                { id: 3, human_id: 1, name: 'Mizute'}
            ]));

            expect(entries[0].getField('id').value()).toEqual(1);
            expect(entries[0].getField('name').value()).toEqual('Suna...');
            expect(entries[2].getField('id').value()).toEqual(3);
            expect(entries[2].getField('name').value()).toEqual('Mizut...');
        });

    });
});
