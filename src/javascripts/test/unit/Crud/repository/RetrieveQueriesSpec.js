/*global define,jasmine,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var RetrieveQueries = require('ng-admin/Crud/repository/RetrieveQueries'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Entry = require('ng-admin/Main/component/service/config/Entry'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        ReferencedList = require('ng-admin/Main/component/service/config/ReferencedList'),
        ReferenceMany = require('ng-admin/Main/component/service/config/ReferenceMany'),
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
                    getQueryParamsFor: function (view, params) {
                        return params;
                    },
                    getRouteFor: function (view) {
                        return 'http://localhost/' + view.getEntity().name();
                    }
                };
            };

            catEntity = new Entity('cat');
            humanEntity = new Entity('human');
            catView = catEntity.listView()
                .addField(new Field('id').identifier(true))
                .addField(new Field('name').type('text'))
                .addField(new Reference('human_id').targetEntity(humanEntity).targetField(new Field('firstName')));

            humanEntity.identifier(new Field('id'));

            rawCats = [
                {"id": 1, "human_id": 1, "name": "Mizoute", "summary": "A Cat"},
                {"id": 2, "human_id": 1, "name": "Suna", "summary": "A little Cat"}
            ];

            cats = [
                new Entry(rawCats[0]),
                new Entry(rawCats[1])
            ];

            rawHumans = [
                {"id": 1, "firstName": "Daph"},
                {"id": 2, "firstName": "Manu"},
                {"id": 3, "firstName": "Daniel"}
            ];

            humans = [
                new Entry(rawHumans[0]),
                new Entry(rawHumans[1]),
                new Entry(rawHumans[2])
            ];
        });

        it('should return all data to display a ListView', function () {
            Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({data: rawCats}));
            $q.all = jasmine.createSpy('all').andReturn(mixins.buildPromise(humans));

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
                });
        });

        it('should return all rawEntities with an extra header', function () {
            Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({data: rawCats}));

            var retrieveQueries = new RetrieveQueries({}, Restangular, config);

            catView.perPage(10)
                .headers({token: 'def'});

            retrieveQueries.getRawValues(catView)
                .then(function (rawEntities) {
                    expect(Restangular.allUrl).toHaveBeenCalledWith('myView', 'http://localhost/cat');
                    expect(Restangular.getList).toHaveBeenCalledWith({page : 1, per_page : 10}, {token: 'def'});
                    expect(rawEntities.data.length).toEqual(2);
                });
        });

        it('should return all references values for a View with multiple calls', function () {
            var retrieveQueries = new RetrieveQueries($q, Restangular, config),
                post = new Entity('posts'),
                author = new Entity('authors'),
                authorRef = new Reference('author');

            var rawPosts = [
                {id: 1, author: 'abc'},
                {id: 2, author: '19DFE'}
            ];

            var authors = [
                new Entry({id: 'abc', name: 'Rollo'}),
                new Entry({id: '19DFE', name: 'Ragna'})
            ];

            authorRef.targetEntity(author);
            authorRef.targetField(new Field('name'));
            post.listView()
                .addField(authorRef);

            Restangular.getList = jasmine.createSpy('get').andReturn(mixins.buildPromise({}));
            Restangular.getList = jasmine.createSpy('get').andReturn(mixins.buildPromise({}));
            $q.all = jasmine.createSpy('all').andReturn(mixins.buildPromise([authors[0], authors[1]]));

            retrieveQueries.getReferencedValues(post.listView(), rawPosts)
                .then(function (references) {
                    expect(references.author.getEntries().length).toEqual(2);
                    expect(references.author.getEntries()[0].values.id).toEqual('abc');
                    expect(references.author.getEntries()[1].values.name).toEqual('Ragna');
                });
        });

        iit('should return all referencedLists values for a View', function () {
            var retrieveQueries = new RetrieveQueries($q, Restangular, config),
                state = new Entity('states'),
                stateId = new Field('id').identifier(true),
                character = new Entity('characters'),
                stateCharacters = new ReferencedList('character');

            var rawCharacters = [{
                id: 'abc',
                state_id: 1,
                name: 'Rollo',
                age: 35,
                eyes: 'blue'
            }, {
                id: '19DFE',
                state_id: 1,
                name: 'Ragna',
                age: 33,
                eyes: 'brown'
            }, {
                id: '1G53a',
                state_id: 2,
                name: 'Aelle',
                age: 45,
                eyes: 'brown'
            }];

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

            Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({data: rawCharacters}));
            $q.all = jasmine.createSpy('all').andReturn(mixins.buildPromise([{data: rawCharacters}]));

            retrieveQueries.getReferencedListValues(state.listView(), null, null, 1)
                .then(function (references) {
                    var entries = references.character.getEntries();

                    expect(entries.length).toEqual(3);
                    expect(entries[0].values.name).toEqual('Rollo');
                    expect(entries[1].values.id).toEqual('19DFE');
                });
        });

        it('should fill reference values of a collection', function () {
            var retrieveQueries = new RetrieveQueries({}, Restangular, config),
                entry1 = new Entry(),
                entry2 = new Entry(),
                entry3 = new Entry(),
                human = new Entity('humans'),
                tag = new Entity('tags'),
                ref1 = new Reference('human_id'),
                ref2 = new ReferenceMany('tags');

            human.editionView().identifier(new Field('id'));
            tag.editionView().identifier(new Field('id'));
            ref1
                .targetEntity(human)
                .targetField(new Field('name'))
                .setEntries([
                    {values: {id: 1, name: 'Bob'}},
                    {values: {id: 2, name: 'Daniel'}},
                    {values: {id: 3, name: 'Jack'}}
                ]);

            ref2
                .targetEntity(tag)
                .targetField(new Field('label'))
                .setEntries([
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
                    .addField(new Field('name').type('text'))
                    .extraParams(null)
                    .interceptor(null);
            });

            it('should return the entity with all fields.', function () {
                Restangular.get = jasmine.createSpy('get').andReturn(mixins.buildPromise({
                    data: {
                        "id": 1,
                        "name": "Mizoute",
                        "summary": "A Cat"
                    }
                }));

                var retrieveQueries = new RetrieveQueries({}, Restangular, config);

                retrieveQueries.getOne(view, 1)
                    .then(function (entry) {
                        expect(Restangular.oneUrl).toHaveBeenCalledWith('myView', 'http://localhost/cat/1');
                        expect(Restangular.get).toHaveBeenCalledWith({}, {});
                        expect(entry.identifierValue).toBe(1);
                        expect(entry.values.id).toBe(1);
                        expect(entry.values.name).toBe('Mizoute');

                        // Non mapped field should also be retrieved
                        expect(entry.values.summary).toBe("A Cat");
                    });
            });

            it('should add response interceptor, extra params & headers when calling getOne', function () {
                var catInterceptor;
                view.interceptor(catInterceptor = function () {
                });

                view.extraParams(function () {
                    return {
                        key: 'abc'
                    };
                });

                view.headers(function () {
                    return {
                        pwd: '123456'
                    };
                });

                Restangular.addResponseInterceptor = jasmine.createSpy('addResponseInterceptor');
                Restangular.get = jasmine.createSpy('get').andReturn(mixins.buildPromise({
                    data: {
                        id: 1,
                        name: "Mizoute",
                        summary: "A Cat"
                    }
                }));

                var retrieveQueries = new RetrieveQueries({}, Restangular, config);

                retrieveQueries.getOne(view, 1)
                    .then(function () {
                        expect(Restangular.oneUrl).toHaveBeenCalledWith('myView', 'http://localhost/cat/1');
                        expect(Restangular.get).toHaveBeenCalledWith({key: 'abc'}, {pwd: '123456'});
                        expect(Restangular.addResponseInterceptor).toHaveBeenCalledWith(catInterceptor);
                    });
            });
        });
    });
});
