var assert = require('chai').assert;

import Entry from "../../../lib/Entry";
import Entity from "../../../lib/Entity/Entity";
import Field from "../../../lib/Field/Field";
import ReferenceField from "../../../lib/Field/ReferenceField";

describe('ReferenceField', function() {
    describe('detailLink', function() {
        it('should be a detail link by default', function() {
            var field = new ReferenceField('foo');
            assert.equal(true, field.isDetailLink());
        });
    });

    describe('getChoicesById', function () {
        it('should retrieve choices by id.', function () {
            var ref = new ReferenceField('human_id'),
                human = new Entity('human');

            human
                .identifier(new Field('id'))
                .editionView()
                .addField(new Field('id').identifier(true));

            ref
                .targetEntity(human)
                .targetField(new Field('name'));

            ref.entries = [
                {values: { id: 1, human_id: 1, name: 'Suna'}},
                {values: { id: 2, human_id: 2, name: 'Boby'}},
                {values: { id: 3, human_id: 1, name: 'Mizute'}}
            ];

            var choices = ref.getChoicesById();
            assert.equal(ref.type(), 'reference');
            assert.deepEqual(choices, {
                1: 'Suna',
                2: 'Boby',
                3: 'Mizute'
            });
        });
    });

    describe('choices', function () {
        it('should retrieve choices.', function () {
            var ref = new ReferenceField('human_id'),
                human = new Entity('human');

            human
                .identifier(new Field('id'))
                .editionView()
                .addField(new Field('id').identifier(true));

            ref
                .targetField(new Field('name'))
                .targetEntity(human);

            ref.entries = [
                new Entry('human', { id: 1, human_id: 1, name: 'Suna'}),
                new Entry('human', { id: 2, human_id: 2, name: 'Boby'}),
                new Entry('human', { id: 3, human_id: 1, name: 'Mizute'})
            ];

            assert.equal(ref.type(), 'reference');
            assert.deepEqual(ref.choices(), [
                { value: 1, label: 'Suna'},
                { value: 2, label: 'Boby'},
                { value: 3, label: 'Mizute'}
            ]);
        });
    });

    it('Should create a fake view to keep entity', function () {
        var post = new Entity('posts'),
            comment = new Entity('comments');

        comment.listView()
            .addField(new ReferenceField('post_id')
                .targetEntity(post)
                .targetField(new Field('id'))
            );

        var fieldName = comment.views["ListView"].getField('post_id').getReferencedView().getEntity().name();
        assert.equal(fieldName, 'posts');
    });

    describe('getSortFieldName', function () {
        it('should retrieve sortField', function () {
            var ref = new ReferenceField('human_id'),
                human = new Entity('human');

            ref.entries = [
                new Entry({ id: 1, human_id: 1, name: 'Suna'}),
                new Entry({ id: 2, human_id: 2, name: 'Boby'}),
                new Entry({ id: 3, human_id: 1, name: 'Mizute'})
            ];

            ref
                .targetEntity(human)
                .targetField(new Field('name'));

            human
                .identifier(new Field('id'))
                .editionView()
                .addField(new Field('id').identifier(true));

            assert.equal(ref.getSortFieldName(), 'human_ListView.name');
        });
    });

    describe('getIdentifierValues', function () {
        it('Should return identifier values', function () {
            var view = new ReferenceField('tags'),
                identifiers;

            identifiers = view.getIdentifierValues([{_id: 1, tags:[1, 3]}, {_id:3, id:6, tags:[4, 3]}]);
            assert.deepEqual(identifiers, ['1', '3', '4']);
        });

        it('Should not return undefined values', function () {
            var view = new ReferenceField('tags'),
                identifiers;

            identifiers = view.getIdentifierValues([{_id: 1, tags:undefined}, {_id:3, id:6, tags:[3]}]);
            assert.deepEqual(identifiers, ['3']);
        });
    });

    describe('targetField / targetEntity interactions', function() {
        var ref, human;

        beforeEach(function() {
            ref = new ReferenceField('human_id');
            human = new Entity('human');

            human
                .identifier(new Field('id'))
                .editionView()
                .addField(new Field('id').identifier(true));
        });

        it('should allow to call targetField before targetEntity', function() {
            ref
                .targetField(new Field('name'))
                .targetEntity(human);

            assert.equal('name', ref.getReferencedView().fields()['name'].name());
        });

        it('should allow to call targetField after targetEntity', function() {
            ref
                .targetEntity(human)
                .targetField(new Field('name'));

            assert.equal('name', ref.getReferencedView().fields()['name'].name());
        });
    });
});
