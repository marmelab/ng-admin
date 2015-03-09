/*global define,jasmine,spyOn,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var RetrieveQueries = require('ng-admin/Crud/repository/RetrieveQueries'),
        Field = require('ng-admin/es6/lib/Field/Field'),
        TextField = require('ng-admin/es6/lib/Field/TextField'),
        Entity = require('ng-admin/es6/lib/Entity/Entity'),
        Entry = require('ng-admin/es6/lib/Entry'),
        ReferenceField = require('ng-admin/es6/lib/Field/ReferenceField'),
        ReferencedListField = require('ng-admin/es6/lib/Field/ReferencedListField'),
        ReferenceManyField = require('ng-admin/es6/lib/Field/ReferenceManyField'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        $q = require('mock/q'),
        config,
        cats,
        rawCats,
        humans,
        rawHumans,
        catEntity,
        humanEntity,
        catView,
        entity,
        view;

    describe("Service: RetrieveQueries", function () {

        beforeEach(function () {
            config = function () {
                return {
                    baseApiUrl: angular.noop,
                    getRouteFor: function (view) {
                        return 'http://localhost/' + view.getEntity().name();
                    }
                };
            };

            catEntity = new Entity('cat');
            humanEntity = new Entity('human');
            catView = catEntity.listView()
                .addField(new Field('id').identifier(true))
                .addField(new TextField('name'))
                .addField(new ReferenceField('human_id').targetEntity(humanEntity).targetField(new Field('firstName')));

            humanEntity.identifier(new Field('id'));

            rawCats = [
                {"id": 1, "human_id": 1, "name": "Mizoute", "summary": "A Cat"},
                {"id": 2, "human_id": 1, "name": "Suna", "summary": "A little Cat"}
            ];

            cats = [
                new Entry('cat', rawCats[0]),
                new Entry('cat', rawCats[1])
            ];

            rawHumans = [
                {"id": 1, "firstName": "Daph"},
                {"id": 2, "firstName": "Manu"},
                {"id": 3, "firstName": "Daniel"}
            ];

            humans = [
                new Entry('human', rawHumans[0]),
                new Entry('human', rawHumans[1]),
                new Entry('human', rawHumans[2])
            ];
        });

        it('should return all data to display a ListView', function (done) {
            spyOn(Restangular, 'getList').and.returnValue(mixins.buildPromise({data: rawCats, headers: function() {}}));
            spyOn($q, 'all').and.returnValue(mixins.buildPromise(humans));

            var retrieveQueries = new RetrieveQueries($q, Restangular, config);

            retrieveQueries.getAll(catView)
                .then(function (result) {
                    expect(result.currentPage).toEqual(1);
                    expect(result.perPage).toEqual(30);
                    expect(result.totalItems).toEqual(2);
                    expect(result.entries.length).toEqual(2);

                    expect(result.entries[0].values.id).toEqual(1);
                    expect(result.entries[0].values.name).toEqual('Mizoute');

                    expect(result.entries[0].values.human_id).toEqual(1);
                    expect(result.entries[0].listValues.human_id).toEqual('Daph');
                })
                .then(done, done.fail);
        });

        it('should return all references values for a View with multiple calls', function (done) {
            var retrieveQueries = new RetrieveQueries($q, Restangular, config),
                post = new Entity('posts'),
                author = new Entity('authors'),
                authorRef = new ReferenceField('author');

            var rawPosts = [
                {id: 1, author: 'abc'},
                {id: 2, author: '19DFE'}
            ];

            var authors = [
                new Entry('author', {id: 'abc', name: 'Rollo'}),
                new Entry('author', {id: '19DFE', name: 'Ragna'})
            ];

            authorRef.targetEntity(author);
            authorRef.targetField(new Field('name'));
            post.listView()
                .addField(authorRef);

            spyOn(Restangular, 'get').and.returnValue(mixins.buildPromise(mixins.buildPromise({})));
            spyOn($q, 'all').and.returnValue(mixins.buildPromise([authors[0], authors[1]]));

            retrieveQueries.getReferencedValues(post.listView().getReferences(), rawPosts)
                .then(function (references) {
                    expect(references.author.entries.length).toEqual(2);
                    expect(references.author.entries[0].values.id).toEqual('abc');
                    expect(references.author.entries[1].values.name).toEqual('Ragna');
                })
                .then(done, done.fail);
        });

        it('should return all references values for a View with one call', function (done) {
            var retrieveQueries = new RetrieveQueries($q, Restangular, config),
                post = new Entity('posts'),
                author = new Entity('authors'),
                authorRef = new ReferenceField('author');

            authorRef.singleApiCall(function (ids) {
                return {
                    id: ids
                };
            });

            var rawPosts = [
                {id: 1, author: 'abc'},
                {id: 2, author: '19DFE'}
            ];

            var rawAuthors = [
                {id: 'abc', name: 'Rollo'},
                {id: '19DFE', name: 'Ragna'}
            ];

            var authors = [
                new Entry('authors', rawAuthors[0]),
                new Entry('authors', rawAuthors[1])
            ];

            authorRef.targetEntity(author);
            authorRef.targetField(new Field('name'));
            post.listView()
                .addField(authorRef);

            spyOn(Restangular, 'getList').and.returnValue(mixins.buildPromise(mixins.buildPromise({})));
            spyOn($q, 'all').and.returnValue(mixins.buildPromise([{data: rawAuthors}]));

            retrieveQueries.getReferencedValues(post.listView().getReferences(), rawPosts)
                .then(function (references) {
                    expect(references.author.entries.length).toEqual(2);
                    expect(references.author.entries[0].values.id).toEqual('abc');
                    expect(references.author.entries[1].values.name).toEqual('Ragna');
                })
                .then(done, done.fail);
        });

        it('should return all referencedLists values for a View', function (done) {
            var retrieveQueries = new RetrieveQueries($q, Restangular, config),
                state = new Entity('states'),
                stateId = new Field('id').identifier(true),
                character = new Entity('characters'),
                stateCharacters = new ReferencedListField('character');

            var rawCharacters = [
                {id: 'abc', state_id: 1, name: 'Rollo', age: 35, eyes: 'blue'},
                {id: '19DFE', state_id: 1, name: 'Ragna', age: 33, eyes: 'brown'},
                {id: '1G53a', state_id: 2, name: 'Aelle', age: 45, eyes: 'brown'}
            ];

            stateCharacters
                .targetReferenceField('state_id')
                .targetFields([
                    new Field('id'),
                    new Field('name'),
                    new Field('state_id')
                ])
                .targetEntity(character);

            state.listView()
                .addField(stateId)
                .addField(stateCharacters);

            spyOn(Restangular, 'getList').and.returnValue(mixins.buildPromise(mixins.buildPromise({data: rawCharacters})));
            spyOn($q, 'all').and.returnValue(mixins.buildPromise([{data: rawCharacters}]));

            retrieveQueries.getReferencedListValues(state.listView(), null, null, 1)
                .then(function (references) {
                    var entries = references.character.entries;

                    expect(entries.length).toEqual(3);
                    expect(entries[0].values.name).toEqual('Rollo');
                    expect(entries[1].values.id).toEqual('19DFE');
                })
                .then(done, done.fail);
        });

        it('should fill reference values of a collection', function () {
            var retrieveQueries = new RetrieveQueries({}, Restangular, config),
                entry1 = new Entry(),
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
            ref1.entries = [
                {values: {id: 1, name: 'Bob'}},
                {values: {id: 2, name: 'Daniel'}},
                {values: {id: 3, name: 'Jack'}}
            ];

            ref2
                .targetEntity(tag)
                .targetField(new Field('label'));
            ref2.entries = [
                {values: {id: 1, label: 'Photo'}},
                {values: {id: 2, label: 'Watch'}},
                {values: {id: 3, label: 'Panda'}}
            ];

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

            collection = retrieveQueries.fillReferencesValuesFromCollection(collection, referencedValues, true);

            expect(collection.length).toEqual(3);
            expect(collection[0].listValues.human_id).toEqual('Bob');
            expect(collection[0].listValues.tags).toEqual(['Photo', 'Panda']);
            expect(collection[1].listValues.tags).toEqual(['Watch']);
            expect(collection[2].listValues.human_id).toEqual('Jack');
            expect(collection[2].listValues.tags).toEqual([]);
        });

        describe("getOne", function () {

            beforeEach(function () {
                config = function () {
                    return {
                        baseApiUrl: angular.noop,
                        getQueryParamsFor: function (view, params) {
                            return params;
                        },
                        getRouteFor: function (view, identyId) {
                            return 'http://localhost/' + view.getEntity().name() + (identyId ? '/' + identyId : '');
                        }
                    };
                };

                entity = new Entity('cat');
                view = entity.creationView()
                    .addField(new Field('id').identifier(true))
                    .addField(new TextField('name'));
            });

            it('should return the entity with all fields.', function (done) {
                spyOn(Restangular, 'oneUrl').and.callThrough();
                spyOn(Restangular, 'get').and.returnValue(mixins.buildPromise({
                    data: {
                        "id": 1,
                        "name": "Mizoute",
                        "summary": "A Cat"
                    }
                }));

                var retrieveQueries = new RetrieveQueries({}, Restangular, config);

                retrieveQueries.getOne(view, 1)
                    .then(function (entry) {
                        expect(Restangular.oneUrl).toHaveBeenCalledWith('cat', 'http://localhost/cat/1');
                        expect(Restangular.get).toHaveBeenCalledWith();
                        expect(entry.identifierValue).toBe(1);
                        expect(entry.values.id).toBe(1);
                        expect(entry.values.name).toBe('Mizoute');

                        // Non mapped field should also be retrieved
                        expect(entry.values.summary).toBe("A Cat");
                    })
                    .then(done, done.fail);
            });

        });
    });
});
