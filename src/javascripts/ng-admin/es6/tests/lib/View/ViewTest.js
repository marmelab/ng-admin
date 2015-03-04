var assert = require('chai').assert;

import Entity from "../../../lib/Entity/Entity";
import Field from "../../../lib/Field/Field";
import ReferenceField from "../../../lib/Field/ReferenceField";
import ReferenceManyField from "../../../lib/Field/ReferenceManyField";
import View from "../../../lib/View/View";
import ListView from "../../../lib/View/ListView";

describe.only('View', function() {
    describe('name()', function() {
        it('should return a default name based on the entity name and view type', function() {
            var view = new ListView(new Entity('foobar'));
            assert.equal(view.name(), 'foobar_ListView');
        });
    });

    describe('title()', function() {
        it('should return false by default', function () {
            var view = new ListView(new Entity('foobar'));
            assert.isFalse(view.title());
        });

        it('should return the view title', function () {
            var view = new View(new Entity('foobar')).title('my-title');
            assert.equal(view.title(), 'my-title');
        });
    });

    describe('description()', function() {
        it('should return empty string by default', function () {
            var view = new View(new Entity('foobar'));
            assert.equal(view.description(), '');
        });

        it('should return the view description', function () {
            var view = new View(new Entity('foobar')).description('my description');
            assert.equal(view.description(), 'my description');
        });
    });

    describe('getReferenceFields()', function() {
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
