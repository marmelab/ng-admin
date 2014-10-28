define(function(require) {
    'use strict';

    var ListViewRepository = require('ng-admin/Crud/component/service/ListViewRepository'),
        ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        config,
        rawCats,
        entity,
        view;

    describe("Service: ListViewRepository", function () {
        beforeEach(function() {
            config = function() {
                return {
                    baseApiUrl: angular.noop
                };
            };

            entity = new Entity('cat');
            view = new ListView('myListView')
                .addField(new Field('id').identifier(true))
                .addField(new Field('name').type('text'));

            entity.addView(view);

            rawCats = [{
                "id": 1,
                "name": "Mizoute",
                "summary": "A Cat"
            },{
                "id": 2,
                "name": "Suna",
                "summary": "A little Cat"
            }];
        });

        //describe("getAll", function() {
        //    it('should return all references values for a View', function () {
        //    });
        //});

        //describe("getReferencedValues", function() {
        //    it('should return all references values for a View', function () {
        //        var listViewRepository = new ListViewRepository({}, Restangular, config);
        //        var post = new Entity('posts'),
        //            postList = new ListView(),
        //            author = new Entity('authors'),
        //            authorRef = new Reference('author');
        //
        //        var rawAuthors = [{
        //            id: 'abc',
        //            name: 'Rollo'
        //        },{
        //            id: '19DFE',
        //            name: 'Ragna'
        //        }];
        //
        //        authorRef.setEntity(author);
        //        postList.addField(authorRef);
        //        post.addView(postList);
        //
        //        Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise(rawAuthors));
        //
        //        listViewRepository.getReferencedValues(postList)
        //            .then(function (references) {
        //               console.log(references);
        //            });
        //    });
        //});

        //describe("getReferencedListValues", function() {
        //    it('should returns all ReferencedList fields', function () {
        //
        //    });
        //});

        describe("getRawValues", function() {
            it('should return all rawEntities with an extra header', function () {
                Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise(rawCats));

                var listViewRepository = new ListViewRepository({}, Restangular, config);

                view.perPage(10)
                    .headers({token: 'def'});

                listViewRepository.getRawValues(view)
                    .then(function (rawEntities) {
                        expect(Restangular.all).toHaveBeenCalledWith('cat');
                        expect(Restangular.getList).toHaveBeenCalledWith({page : 1, per_page : 10}, {token: 'def'});
                        expect(rawEntities.length).toEqual(2);
                    });
            });
        });
    });
});
