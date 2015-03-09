var assert = require('chai').assert;

import Entry from "../../../lib/Entry";
import Entity from "../../../lib/Entity/Entity";
import Field from "../../../lib/Field/Field";
import ReferencedListField from "../../../lib/Field/ReferencedListField";
import ReferenceManyField from "../../../lib/Field/ReferenceManyField";

describe('ReferencedListField', function() {
    it('should retrieve referenceMany fields.', function () {
        var entity = new Entity('comments');

        var referencedList = new ReferencedListField('myField'),
            ref1 = new ReferenceManyField('ref1'),
            ref2 = new ReferenceManyField('ref2');

        referencedList
            .targetEntity(entity)
            .targetFields([ref1, ref2]);

        var references = referencedList.targetFields();
        assert.equal(references.length, 2);
        assert.equal(references[0].name(), 'ref1');
    });

    it('should return information about grid column.', function () {
        var entity = new Entity('comments');

        var referencedList = new ReferencedListField('myField'),
            field1 = new Field('f1').label('Field 1'),
            field2 = new Field('f2').label('Field 2');

        referencedList
            .targetEntity(entity)
            .targetFields([field1, field2]);

        var columns = referencedList.getGridColumns();

        assert.equal(columns.length, 2);
        assert.equal(columns[0].label, 'Field 1');
        assert.equal(columns[1].field.name(), 'f2');
    });

    it('should store target entity configuration', function () {
        var entity = new Entity('comments');

        var post = new Entity('posts');
        post.editionView()
            .addField(new ReferencedListField('comments')
                .targetEntity(entity)
                .targetField(new Field('id'))
        );

        assert.isNotNull(post.views['EditView'].getField('comments').targetEntity().listView());
    });
});
