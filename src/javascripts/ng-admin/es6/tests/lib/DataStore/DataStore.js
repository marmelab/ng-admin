var assert = require('chai').assert;

import DataStore from "../../../lib/DataStore/DataStore";
import Entity from "../../../lib/Entity/Entity";
import Entry from "../../../lib/Entry";
import Field from "../../../lib/Field/Field";
import ReferenceField from "../../../lib/Field/ReferenceField";
import ReferenceManyField from "../../../lib/Field/ReferenceManyField";
import View from "../../../lib/View/View";

describe('DataStore', function() {
    var dataStore;

    beforeEach(function() {
        dataStore = new DataStore();
    });

    it('should map some raw entities', function () {
        var view = new View();
        view
            .addField(new Field('post_id').identifier(true))
            .addField(new Field('title'))
            .setEntity(new Entity());

        var entries = dataStore.mapEntries(view.entity.name(), view.identifier(), view.getFields(), [
            { post_id: 1, title: 'Hello', published: true},
            { post_id: 2, title: 'World', published: false},
            { post_id: 3, title: 'How to use ng-admin', published: false}
        ]);

        assert.equal(entries.length, 3);
        assert.equal(entries[0].identifierValue, 1);
        assert.equal(entries[1].values.title, 'World');
        assert.equal(entries[1].values.published, false);
    });

    it('should map some one entity when the identifier is not in the view', function () {
        var view = new View(),
            field = new Field('title'),
            entity = new Entity('posts');

        view
            .addField(field)
            .setEntity(entity);

        entity
            .identifier(new Field('post_id'));

        var entry = dataStore.mapEntry(entity.name(), view.identifier(), view.getFields(), {
            post_id: 1,
            title: 'Hello',
            published: true
        });
        assert.equal(entry.identifierValue, 1);
        assert.equal(entry.values.title, 'Hello');
    });

    describe('getReferenceChoicesById', function () {
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

            dataStore.setEntries(human.uniqueId + '_values', [
                {values: { id: 1, human_id: 1, name: 'Suna'}},
                {values: { id: 2, human_id: 2, name: 'Boby'}},
                {values: { id: 3, human_id: 1, name: 'Mizute'}}
            ]);

            var choices = dataStore.getReferenceChoicesById(ref);
            assert.equal(ref.type(), 'reference');
            assert.deepEqual(choices, {
                1: 'Suna',
                2: 'Boby',
                3: 'Mizute'
            });
        });
    });

    describe('getChoices', function () {
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

            dataStore.setEntries(human.uniqueId + '_choices', [
                new Entry('human', { id: 1, human_id: 1, name: 'Suna'}),
                new Entry('human', { id: 2, human_id: 2, name: 'Boby'}),
                new Entry('human', { id: 3, human_id: 1, name: 'Mizute'})
            ]);

            assert.equal(ref.type(), 'reference');
            assert.deepEqual(dataStore.getChoices(ref), [
                { value: 1, label: 'Suna'},
                { value: 2, label: 'Boby'},
                { value: 3, label: 'Mizute'}
            ]);
        });
    });

    describe('fillReferencesValuesFromCollection', function() {
        it('should fill reference values of a collection', function () {
            var entry1 = new Entry(),
                entry2 = new Entry(),
                entry3 = new Entry(),
                human = new Entity('humans'),
                tag = new Entity('tags'),
                ref1 = new ReferenceField('human_id'),
                ref2 = new ReferenceManyField('tags');

            human.editionView().identifier(new Field('id'));
            tag.editionView().identifier(new Field('id'));
            ref1
                .targetEntity(human)
                .targetField(new Field('name'));
            dataStore.setEntries(ref1.targetEntity().uniqueId + '_values', [
                {values: {id: 1, name: 'Bob'}},
                {values: {id: 2, name: 'Daniel'}},
                {values: {id: 3, name: 'Jack'}}
            ]);

            ref2
                .targetEntity(tag)
                .targetField(new Field('label'));
            dataStore.setEntries(ref2.targetEntity().uniqueId + '_values', [
                {values: {id: 1, label: 'Photo'}},
                {values: {id: 2, label: 'Watch'}},
                {values: {id: 3, label: 'Panda'}}
            ]);

            entry1.values.human_id = 1;
            entry1.values.tags = [1, 3];
            entry2.values.human_id = 1;
            entry2.values.tags = [2];
            entry3.values.human_id = 3;

            var collection = [entry1, entry2, entry3];
            var referencedValues = {
                human_id: ref1,
                tags: ref2
            };

            collection = dataStore.fillReferencesValuesFromCollection(collection, referencedValues, true);

            assert.equal(collection.length, 3);
            assert.equal(collection[0].listValues.human_id, 'Bob');
            assert.deepEqual(collection[0].listValues.tags, ['Photo', 'Panda']);
            assert.deepEqual(collection[1].listValues.tags, ['Watch']);
            assert.equal(collection[2].listValues.human_id, 'Jack');
            assert.deepEqual(collection[2].listValues.tags, []);
        });
    });
});
