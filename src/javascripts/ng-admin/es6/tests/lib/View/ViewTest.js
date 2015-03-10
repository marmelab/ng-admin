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

    describe('addField()', function() {
        it('should add fields and preserve the order', function () {
            var post = new Entity('post');
            var view = new View(post);
            var refMany = new ReferenceManyField('refMany');
            var ref = new ReferenceField('myRef');

            var field = new Field('body');
            view.addField(ref).addField(refMany).addField(field);

            assert.equal(view.getFieldsOfType('reference_many')['refMany'].name(), 'refMany');
            assert.equal(view.getReferences()['refMany'].name(), 'refMany');
            assert.equal(view.getReferences()['myRef'].name(), 'myRef');
            assert.equal(view.getFields()['body'].order(), 2);
        });
    });

    describe('fields()', function() {
        it('should return the fields when called with no arguments', function() {
            var view = new View(new Entity('post'));
            var field = new Field('body').order(1);
            view.addField(field);

            assert.deepEqual(view.fields(), { body: field });
        });

        it('should add fields when called with an array argument', function() {
            var view = new View(new Entity('post'));
            var field1 = new Field('foo');
            var field2 = new Field('bar');
            view.fields([field1, field2]);

            assert.deepEqual(view.fields(), { foo: field1, bar: field2 });
        });

        it('should add a single field when called with a non array argument', function() {
            var view = new View(new Entity('post'));
            var field1 = new Field('foo');
            view.fields(field1);

            assert.deepEqual(view.fields(), { foo: field1 });
        });

        it('should add fields when called with several arguments', function() {
            var view = new View(new Entity('post'));
            var field1 = new Field('foo');
            var field2 = new Field('bar');
            view.fields(field1, field2);

            assert.deepEqual(view.fields(), { foo: field1, bar: field2 });
        });

        it('should add field collections', function() {
            var view1 = new View(new Entity('post'));
            var view2 = new View(new Entity('category'));
            var field1 = new Field('foo');
            var field2 = new Field('bar');
            view1.fields(field1, field2);
            view2.fields(view1.fields());

            assert.deepEqual(view2.fields(), { foo: field1, bar: field2 });
        });

        it('should allow fields reuse', function() {
            var field1 = new Field('foo'), field2 = new Field('bar');
            var view1 = new View().addField(field1);
            var view2 = new View().fields([
                view1.fields(),
                field2
            ]);

            assert.deepEqual(view2.fields(), {
                foo: field1,
                bar: field2
            });
        });

        it('should append fields when multiple calls', function() {
            var view = new View();
            var field1 = new Field('foo'), field2 = new Field('bar');
            view
                .fields(field1)
                .fields(field2);

            assert.deepEqual(view.fields(), { foo: field1, bar: field2 });
        });
    });

    it('should return the identifier.', function () {
        var view = new View(new Entity('post'));
        view
            .addField(new Field('post_id').identifier(true))
            .addField(new Field('name').identifier(false));

        assert.equal(view.identifier().name(), 'post_id');
    });

    it('should map some raw entities', function () {
        var view = new View();
        view
            .addField(new Field('post_id').identifier(true))
            .addField(new Field('title'))
            .setEntity(new Entity());

        var entries = view.mapEntries([
            { post_id: 1, title: 'Hello', published: true},
            { post_id: 2, title: 'World', published: false},
            { post_id: 3, title: 'How to use ng-admin', published: false}
        ]);

        assert.equal(entries.length, 3);
        assert.equal(entries[0].identifierValue, 1);
        assert.equal(entries[1].values.title, 'World');
        assert.equal(entries[1].values.published, false);
    });

    it('should map some one entity when the identifier in not in the view', function () {
        var view = new View(),
            field = new Field('title'),
            entity = new Entity('posts');

        view
            .addField(field)
            .setEntity(entity);

        entity
            .identifier(new Field('post_id'));

        var entry = view.mapEntry({ post_id: 1, title: 'Hello', published: true});
        assert.equal(entry.identifierValue, 1);
        assert.equal(entry.values.title, 'Hello');
    });
});
