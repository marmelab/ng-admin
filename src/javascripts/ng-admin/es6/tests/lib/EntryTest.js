var assert = require('chai').assert;

import Entity from "../../lib/Entity/Entity";
import Entry from "../../lib/Entry";
import Field from "../../lib/Field/Field";
import ReferenceManyField from "../../lib/Field/ReferenceManyField";

describe('Entry', function() {
    describe('mapFromRest', function() {
        var entity, fields;

        beforeEach(function() {
            entity = new Entity('post');
            fields = [
                new Field('id').identifier(true),
                new Field('title'),
                new ReferenceManyField('tags')
            ]
        });

        it('should return entry with no value if REST entry is empty', function() {
            var mappedEntry = Entry.mapFromRest(entity.listView(), {});
            assert.deepEqual({}, mappedEntry.values);
        });

        it('should map each value to related field if existing', function() {
            var mappedEntry = Entry.mapFromRest(entity.listView(), {
                id: 1,
                title: 'ng-admin + ES6 = pure awesomeness!',
                body: 'Really, it rocks!',
                tags: [1, 2, 4]
            });

            assert.deepEqual({
                id: 1,
                title: 'ng-admin + ES6 = pure awesomeness!',
                body: 'Really, it rocks!',
                tags: [1, 2, 4]
            }, mappedEntry.values);
        });

        it('should set as identifierValue value for identifier field', function() {
            var mappedEntry = Entry.mapFromRest(entity.listView(), { id: 1 });
            assert.equal(1, mappedEntry.identifierValue);
        });
    });
});
