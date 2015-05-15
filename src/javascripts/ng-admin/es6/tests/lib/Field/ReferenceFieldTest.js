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

    it('Should create a fake view to keep entity', function () {
        var post = new Entity('posts'),
            comment = new Entity('comments');

        comment.listView()
            .addField(new ReferenceField('post_id')
                .targetEntity(post)
                .targetField(new Field('id'))
            );

        var fieldName = comment.views["ListView"].getField('post_id').targetEntity().name();
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
                .editionView();

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
});
