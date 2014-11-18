/*global define,jasmine,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var ListViewRepository = require('ng-admin/Crud/component/service/ListViewRepository'),
        ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        EditView = require('ng-admin/Main/component/service/config/view/EditView'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Entry = require('ng-admin/Main/component/service/config/Entry'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        ReferencedList = require('ng-admin/Main/component/service/config/ReferencedList'),
        ReferenceMany = require('ng-admin/Main/component/service/config/ReferenceMany'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        $q = require('mock/q'),
        config,
        rawCats,
        catEntity,
        humanEntity,
        catView,
        rawHumans;

    describe("Service: ListViewRepository", function () {
        beforeEach(function () {
            config = function () {
                return {
                    baseApiUrl: angular.noop
                };
            };

            catEntity = new Entity('cat');
            humanEntity = new Entity('human');
            catView = new ListView('myListView')
                .addField(new Field('id').identifier(true))
                .addField(new Field('name').type('text'))
                .addField(new Reference('human_id').targetEntity(humanEntity).targetField(new Field('firstName')));

            catEntity.addView(catView);
            humanEntity.identifier(new Field('id'));

            rawCats = [{
                "id": 1,
                "human_id": 1,
                "name": "Mizoute",
                "summary": "A Cat"
            }, {
                "id": 2,
                "human_id": 1,
                "name": "Suna",
                "summary": "A little Cat"
            }];

            rawHumans = [{
                "id": 1,
                "firstName": "Daph"
            }, {
                "id": 2,
                "firstName": "Manu"
            }, {
                "id": 3,
                "firstName": "Daniel"
            }];
        });

        it('should return all data to display a ListView', function () {
            Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({data: rawCats}));
            $q.all = jasmine.createSpy('all').andReturn(mixins.buildPromise([{data: rawHumans}]));

            var listViewRepository = new ListViewRepository($q, Restangular, config);

            listViewRepository.getAll(catView)
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

            var listViewRepository = new ListViewRepository({}, Restangular, config);

            catView.perPage(10)
                .headers({token: 'def'});

            listViewRepository.getRawValues(catView)
                .then(function (rawEntities) {
                    expect(Restangular.all).toHaveBeenCalledWith('cat');
                    expect(Restangular.getList).toHaveBeenCalledWith({page : 1, per_page : 10}, {token: 'def'});
                    expect(rawEntities.data.length).toEqual(2);
                });
        });

        it('should return all references values for a View', function () {
            var listViewRepository = new ListViewRepository($q, Restangular, config),
                post = new Entity('posts'),
                postList = new ListView(),
                author = new Entity('authors'),
                authorRef = new Reference('author');

            var rawAuthors = [{
                id: 'abc',
                name: 'Rollo'
            }, {
                id: '19DFE',
                name: 'Ragna'
            }];

            authorRef.targetEntity(author);
            authorRef.targetField(new Field('name'));
            postList.addField(authorRef);
            post.addView(postList);

            Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({data: rawAuthors}));
            $q.all = jasmine.createSpy('all').andReturn(mixins.buildPromise([{data: rawAuthors}]));

            listViewRepository.getReferencedValues(postList)
                .then(function (references) {
                    expect(references.author.getEntries().length).toEqual(2);
                    expect(references.author.getEntries()[0].id).toEqual('abc');
                    expect(references.author.getEntries()[1].name).toEqual('Ragna');
                });
        });

        it('should return all referencedLists values for a View', function () {
            var listViewRepository = new ListViewRepository($q, Restangular, config),
                state = new Entity('states'),
                stateId = new Field('id').identifier(true),
                stateList = new ListView(),
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

            stateList
                .addField(stateId)
                .addField(stateCharacters);
            state.addView(stateList);

            Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({data: rawCharacters}));
            $q.all = jasmine.createSpy('all').andReturn(mixins.buildPromise([{data: rawCharacters}]));

            listViewRepository.getReferencedListValues(stateList, null, null, 1)
                .then(function (references) {
                    var entries = references.character.getEntries();

                    expect(entries.length).toEqual(2);
                    expect(entries[0].values.name).toEqual('Rollo');
                    expect(entries[1].values.id).toEqual('19DFE');
                });
        });

        it('should fill reference values of a collection', function () {
            var listViewRepository = new ListViewRepository({}, Restangular, config),
                entry1 = new Entry(),
                entry2 = new Entry('catList'),
                entry3 = new Entry('catList'),
                human = new Entity('humans').addView(new EditView('human-list')).identifier(new Field('id')),
                tag = new Entity('tags').addView(new EditView('tags-list')).identifier(new Field('id')),
                ref1 = new Reference('human_id'),
                ref2 = new ReferenceMany('tags');

            ref1
                .targetEntity(human)
                .targetField(new Field('name'))
                .setEntries([
                    {id: 1, name: 'Bob'},
                    {id: 2, name: 'Daniel'},
                    {id: 3, name: 'Jack'}
                ]);

            ref2
                .targetEntity(tag)
                .targetField(new Field('label'))
                .setEntries([
                    {id: 1, label: 'Photo'},
                    {id: 2, label: 'Watch'},
                    {id: 3, label: 'Panda'}
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

            collection = listViewRepository.fillReferencesValuesFromCollection(collection, referencedValues, true);

            expect(collection.length).toEqual(3);
            expect(collection[0].listValues.human_id).toEqual('Bob');
            expect(collection[0].listValues.tags).toEqual(['Photo', 'Panda']);
            expect(collection[1].listValues.tags).toEqual(['Watch']);
            expect(collection[2].listValues.human_id).toEqual('Jack');
            expect(collection[2].listValues.tags).toEqual([]);
        });
    });
});
