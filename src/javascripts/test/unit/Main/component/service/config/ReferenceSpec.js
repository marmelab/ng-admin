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
                    human = new Entity('human'),
                    editView = new EditView();

                editView.addField(new Field('id').identifier(true));

                ref.setEntries([
                    { id: 1, human_id: 1, name: 'Suna'},
                    { id: 2, human_id: 2, name: 'Boby'},
                    { id: 3, human_id: 1, name: 'Mizute'}
                ]);

                ref
                    .targetField(new Field('name'))
                    .targetEntity(human);

                human
                    .identifier(new Field('id'))
                    .addView(editView);

                var choices = ref.getChoicesById();
                expect(ref.type()).toEqual('Reference');
                expect(choices[1]).toEqual('Suna');
                expect(choices[2]).toEqual('Boby');
                expect(choices[3]).toEqual('Mizute');
            });
        });

        describe('getChoices', function () {
            it('should retrieve choices.', function () {
                var ref = new Reference('human_id'),
                    human = new Entity('human'),
                    editView = new EditView();

                editView.addField(new Field('id').identifier(true));

                ref.setEntries([
                    { id: 1, human_id: 1, name: 'Suna'},
                    { id: 2, human_id: 2, name: 'Boby'},
                    { id: 3, human_id: 1, name: 'Mizute'}
                ]);

                ref
                    .targetField(new Field('name'))
                    .targetEntity(human);

                human
                    .identifier(new Field('id'))
                    .addView(editView);

                var choices = ref.getChoices();
                expect(ref.type()).toEqual('Reference');
                expect(ref.getChoices()).toEqual([
                    { id: 1, value: 'Suna'},
                    { id: 2, value: 'Boby'},
                    { id: 3, value: 'Mizute'}
                ]);
            });
        });

        it('Should create a fake view to keep entity', function () {
            var post = new Entity('posts'),
                comment = new Entity('comments');

            comment
                .addView(new ListView('comment-list')
                    .addField(new Reference('post_id')
                        .targetEntity(post)
                        .targetField(new Field('id'))
                        )
                    );

            expect(comment.getViewByType('ListView').getField('post_id').getReferencedView().getEntity().name()).toEqual('posts');
        });

        describe('getSortField', function () {
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
                    .targetField(new Field('name'))
                ;

                human
                    .identifier(new Field('id'))
                    .addView(editView);

                expect(ref.getSortField()).toEqual('human-list.name');
            });
        });

    });
});
