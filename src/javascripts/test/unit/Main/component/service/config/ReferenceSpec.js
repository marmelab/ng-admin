/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var Reference = require('ng-admin/Main/component/service/config/Reference'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        EditView = require('ng-admin/Main/component/service/config/view/EditView'),
        Entity = require('ng-admin/Main/component/service/config/Entity');

    describe("Service: config/Reference", function () {
        describe('getChoicesById', function () {
            it('should retrieve choices by id.', function () {
                var ref = new Reference('human_id'),
                    human = new Entity('human');

                human
                    .identifier(new Field('id'))
                    .editionView()
                        .addField(new Field('id').identifier(true));

                ref
                    .targetField(new Field('name'))
                    .targetEntity(human);

                ref.setEntries([
                    {values: { id: 1, human_id: 1, name: 'Suna'}},
                    {values: { id: 2, human_id: 2, name: 'Boby'}},
                    {values: { id: 3, human_id: 1, name: 'Mizute'}}
                ]);

                var choices = ref.getChoicesById();
                expect(ref.type()).toEqual('Reference');
                expect(choices[1]).toEqual('Suna');
                expect(choices[2]).toEqual('Boby');
                expect(choices[3]).toEqual('Mizute');
            });
        });

        describe('choices', function () {
            it('should retrieve choices.', function () {
                var ref = new Reference('human_id'),
                    human = new Entity('human');

                human
                    .identifier(new Field('id'))
                    .editionView()
                        .addField(new Field('id').identifier(true));

                ref
                    .targetField(new Field('name'))
                    .targetEntity(human);

                ref.setEntries([
                    { id: 1, human_id: 1, name: 'Suna'},
                    { id: 2, human_id: 2, name: 'Boby'},
                    { id: 3, human_id: 1, name: 'Mizute'}
                ]);

                expect(ref.type()).toEqual('Reference');
                expect(ref.choices()).toEqual([
                    { value: 1, label: 'Suna'},
                    { value: 2, label: 'Boby'},
                    { value: 3, label: 'Mizute'}
                ]);
            });

            it('should apply given map to each choices.', function () {
                var ref = new Reference('human_id'),
                    human = new Entity('human');

                human
                    .identifier(new Field('id'))
                    .editionView()
                        .addField(new Field('id').identifier(true));

                ref
                    .targetField(new Field('name').map(function (value, entry) {
                        return entry.name + '(' + entry.gender + ')';
                    }))
                    .targetEntity(human);

                ref.setEntries([
                    { id: 1, human_id: 1, name: 'Suna', gender: 'F'},
                    { id: 2, human_id: 2, name: 'Boby', gender: 'M'},
                    { id: 3, human_id: 1, name: 'Mizute', gender: 'M'}
                ]);

                expect(ref.type()).toEqual('Reference');
                expect(ref.choices()).toEqual([
                    { value: 1, label: 'Suna(F)'},
                    { value: 2, label: 'Boby(M)'},
                    { value: 3, label: 'Mizute(M)'}
                ]);
            });
        });

        it('Should create a fake view to keep entity', function () {
            var post = new Entity('posts'),
                comment = new Entity('comments');

            comment.listView()
                .addField(new Reference('post_id')
                    .targetEntity(post)
                    .targetField(new Field('id'))
                );

            expect(comment.getViewByType('ListView').getField('post_id').getReferencedView().getEntity().name()).toEqual('posts');
        });

        describe('getSortFieldName', function () {
            it('should retrieve sortField', function () {
                var ref = new Reference('human_id'),
                    human = new Entity('human').addView(new ListView('human-list')),
                    editView = new EditView();

                editView.addField(new Field('id').identifier(true));

                ref.setEntries([
                    { id: 1, human_id: 1, name: 'Suna'},
                    { id: 2, human_id: 2, name: 'Boby'},
                    { id: 3, human_id: 1, name: 'Mizute'}
                ]);

                ref
                    .targetEntity(human)
                    .targetField(new Field('name'));

                human
                    .identifier(new Field('id'))
                    .addView(editView);

                expect(ref.getSortFieldName()).toEqual('human-list.name');
            });
        });

        describe('getIdentifierValues', function () {
            it('Should return identifier values', function () {
                var view = new Reference('tags'),
                    identifiers;

                identifiers = view.getIdentifierValues([{_id: 1, tags:[1, 3]}, {_id:3, id:6, tags:[4, 3]}]);
                expect(identifiers).toEqual(['1', '3', '4']);
            });
        });

    });
});
