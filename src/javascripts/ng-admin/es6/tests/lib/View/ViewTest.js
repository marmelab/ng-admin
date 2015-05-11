var assert = require('chai').assert;

import Entity from "../../../lib/Entity/Entity";
import Field from "../../../lib/Field/Field";
import ReferenceField from "../../../lib/Field/ReferenceField";
import ReferenceManyField from "../../../lib/Field/ReferenceManyField";
import View from "../../../lib/View/View";
import ListView from "../../../lib/View/ListView";

describe('View', function() {
    describe('name()', function() {
        it('should return a default name based on the entity name and view type', function() {
            var view = new ListView().setEntity(new Entity('foobar'));
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

    describe('getReferences()', function() {
        it('should return only reference and reference_many fields', function() {
            var post = new Entity('post');
            var category = new ReferenceField('category');
            var tags = new ReferenceManyField('tags');
            var view = new View(post).fields([
                new Field('title'),
                category,
                tags
            ]);

            assert.deepEqual({category: category, tags: tags}, view.getReferences());
        });
    });

    describe('addField()', function() {
        it('should add fields and preserve the order', function () {
            var post = new Entity('post');
            var view = new View(post);
            var refMany = new ReferenceManyField('refMany');
            var ref = new ReferenceField('myRef');

            var field = new Field('body');
            view.addField(ref).addField(refMany).addField(field);

            assert.equal(view.getFieldsOfType('reference_many')[0].name(), 'refMany');
            assert.equal(view.getReferences()['myRef'].name(), 'myRef');
            assert.equal(view.getReferences()['refMany'].name(), 'refMany');
            assert.equal(view.getFields()[2].name(), 'body');
        });
    });

    describe('fields()', function() {
        it('should return the fields when called with no arguments', function() {
            var view = new View(new Entity('post'));
            var field = new Field('body');
            view.addField(field);

            assert.deepEqual(view.fields(), [field]);
        });

        it('should add fields when called with an array argument', function() {
            var view = new View(new Entity('post'));
            var field1 = new Field('foo');
            var field2 = new Field('bar');
            view.fields([field1, field2]);

            assert.deepEqual(view.fields(), [field1, field2]);
        });

        it('should keep the default order of the given array to equal to the index even when more than 10 fields', function() {
            var view = new View(new Entity('post'));
            var fields = Array.from(new Array(11).keys()).map(function (i) {
                return new Field(i);
            });
            view.fields(fields);

            assert.deepEqual(view.fields(), fields);

            fields.map(function (field, index) {
                assert.equal(field.order(), index);
            });
        });

        it('should add fields when called with a nested array argument', function() {
            var view = new View(new Entity('post'));
            var field1 = new Field('foo');
            var field2 = new Field('bar');
            view.fields([field1, [field2]]);

            assert.deepEqual(view.fields(), [field1, field2]);
        });

        it('should add a single field when called with a non array argument', function() {
            var view = new View(new Entity('post'));
            var field1 = new Field('foo');
            view.fields(field1);

            assert.deepEqual(view.fields(), [field1]);
        });

        it('should add fields when called with several arguments', function() {
            var view = new View(new Entity('post'));
            var field1 = new Field('foo');
            var field2 = new Field('bar');
            view.fields(field1, field2);

            assert.deepEqual(view.fields(), [field1, field2]);
        });

        it('should add field collections', function() {
            var view1 = new View(new Entity('post'));
            var view2 = new View(new Entity('category'));
            var field1 = new Field('foo');
            var field2 = new Field('bar');
            view1.fields(field1, field2);
            view2.fields(view1.fields());

            assert.deepEqual(view2.fields(), [field1, field2]);
        });

        it('should allow fields reuse', function() {
            var field1 = new Field('foo'), field2 = new Field('bar');
            var view1 = new View().addField(field1);
            var view2 = new View().fields([
                view1.fields(),
                field2
            ]);

            assert.deepEqual(view2.fields(), [field1, field2]);
        });

        it('should append fields when multiple calls', function() {
            var view = new View();
            var field1 = new Field('foo'), field2 = new Field('bar');
            view
                .fields(field1)
                .fields(field2);

            assert.deepEqual(view.fields(), [field1, field2]);
        });
    });

    it('should return the identifier.', function () {
        var entity = new Entity('post').identifier(new Field('post_id'));
        var view = entity.listView();
        view.addField(new Field('name'));

        assert.equal(view.identifier().name(), 'post_id');
    });
});
