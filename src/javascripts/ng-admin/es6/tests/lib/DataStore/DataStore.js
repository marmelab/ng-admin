var assert = require('chai').assert;

import DataStore from "../../../lib/DataStore/DataStore";
import Entity from "../../../lib/Entity/Entity";
import Entry from "../../../lib/Entry";
import Field from "../../../lib/Field/Field";
import ReferenceField from "../../../lib/Field/ReferenceField";
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

        var entries = dataStore.mapEntries(view, [
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

        var entry = dataStore.mapEntry(view, { post_id: 1, title: 'Hello', published: true});
        assert.equal(entry.identifierValue, 1);
        assert.equal(entry.values.title, 'Hello');
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

            dataStore.setEntries(ref.getReferencedView(), [
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

            dataStore.setEntries(ref.getReferencedView(), [
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
});
