var assert = require('chai').assert;

import Entity from "../../../lib/Entity/Entity";
import Field from "../../../lib/Field/Field";
import ReferenceField from "../../../lib/Field/ReferenceField";
import ReferenceManyField from "../../../lib/Field/ReferenceManyField";
import View from "../../../lib/View/View";

describe('View', function() {
    describe('getReferenceFields', function() {
        it('should return only reference and reference_many fields', function() {
            var post = new Entity('post');

            var view = new View(post);
            view.fields.push(new Field('title'));
            view.fields.push(new ReferenceField('category'));
            view.fields.push(new ReferenceManyField('tags'));

            assert.deepEqual(['category', 'tags'], view.getReferences().map(f => f.name));
        });
    });
});
