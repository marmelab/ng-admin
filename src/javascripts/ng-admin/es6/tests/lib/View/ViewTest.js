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

            var view = new View(post).fields([
                new Field('title'),
                new ReferenceField('category'),
                new ReferenceManyField('tags')
            ]);

            assert.deepEqual(['category', 'tags'], Object.keys(view.getReferences()));
        });
    });
});
