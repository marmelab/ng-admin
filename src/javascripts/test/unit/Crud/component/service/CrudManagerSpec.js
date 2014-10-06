/*global require,describe,module,beforeEach,inject,it,expect*/

define(function(require) {
    'use strict';

    var CrudManager = require('ng-admin/Crud/component/service/CrudManager'),
        Application = require('ng-admin/Main/component/service/config/Application'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        ReferencedList = require('ng-admin/Main/component/service/config/ReferencedList'),
        mixins = require('mixins'),
        $q = require('mock/q'),
        Restangular = require('mock/Restangular');

    describe("Service: CrudManager", function() {
        var rawConfig,
            crudManager,
            catEntity,
            catInterceptor,
            catName,
            catSummary,
            referencedCats,
            humanEntity;

        beforeEach(function() {
            catEntity = new Entity('cat')
                .interceptor(catInterceptor = function(data, operation, what, url, response, deferred){
                    data.push({id: 9, name: 'ninja', summary: 'Ninja cat !'});
                    return data;
                })
                .addField(new Field('id').label('ID').edition('read-only'))
                .addField(catName = new Field('name').label('Name'))
                .addField(catSummary = new Field('summary').label('Summary').valueTransformer(function(value) {
                    return value + "-test";
                }))
                .addField(new Reference('human_id').targetEntity(humanEntity).targetLabel('name'));

            humanEntity = new Entity('human');
            humanEntity
                .extraParams(function () {
                    return {
                        key: 'abc'
                    };
                })
                .pagination(function(page, maxPerPage) {
                    return {
                        offset: (page - 1) * maxPerPage,
                        limit: 100
                    }
                })
                .addField(new Field('id').identifier(true).label('ID').edition('read-only'))
                .addField(new Field('name').label('Name'))
                .addField(
                    referencedCats = new ReferencedList('cats')
                    .label('Comments')
                    .targetEntity(catEntity)
                    .targetField('human_id')
                    .targetFields([catName, catSummary])
                );

            rawConfig = new Application('test')
                .addEntity(catEntity)
                .addEntity(humanEntity);

            var config = function() {
                return rawConfig;
            };

            crudManager = new CrudManager($q, Restangular, config);
            Restangular.addResponseInterceptor =  jasmine.createSpy('addResponseInterceptor');
        });

        describe('extra params', function() {
            it('should be added to all getOne API calls.', function() {
                Restangular.get = jasmine.createSpy('get').andReturn(mixins.buildPromise({data: {}}));

                crudManager.getOne('human', 1)
                    .then(function() {
                        expect(Restangular.one).toHaveBeenCalledWith('human', 1);
                        expect(Restangular.get).toHaveBeenCalledWith({key: 'abc'}, {});
                    });
            });

            it('should be added to all getAll API calls.', function() {
                Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({
                    data: [],
                    headers: function() {}
                }));

                crudManager.getAll('human')
                    .then(function() {
                        expect(Restangular.all).toHaveBeenCalledWith('human');
                        expect(Restangular.getList).toHaveBeenCalledWith({key: 'abc', limit: 100, offset: 0}, {});
                    });
            });
        });

        describe('extra headers', function() {
            it('should be added to all getOne API calls.', function() {
                Restangular.get = jasmine.createSpy('get').andReturn(mixins.buildPromise({data: {}}));
                rawConfig.headers(function() {
                    return {
                        coffee: true
                    }
                });

                crudManager.getOne('cat', 1)
                    .then(function() {
                        expect(Restangular.one).toHaveBeenCalledWith('cat', 1);
                        expect(Restangular.get).toHaveBeenCalledWith({}, {coffee: true});
                        rawConfig.headers({});
                    });
            });

            it('should be added to all getAll API calls.', function() {
                Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({
                    data: [],
                    headers: function() {}
                }));

                rawConfig.headers(function() {
                    return {
                        coffee: "nope"
                    }
                });

                crudManager.getAll('cat')
                    .then(function() {
                        expect(Restangular.all).toHaveBeenCalledWith('cat');
                        expect(Restangular.getList).toHaveBeenCalledWith({page : 1, per_page : 30}, {coffee: "nope"});
                        rawConfig.headers({});
                    });
            });
        });

        describe('getOne', function() {
            it('should return an the entity with only the editable fields.', function() {
                Restangular.get = jasmine.createSpy('get').andReturn(mixins.buildPromise({
                    data: {
                        "id":1,
                        "name":"Mizoute",
                        "summary":"A Cat"
                    }
                }));

                crudManager.getOne('cat', 1)
                    .then(function(data) {
                        expect(Restangular.addResponseInterceptor).toHaveBeenCalledWith(catInterceptor);
                        expect(Restangular.one).toHaveBeenCalledWith('cat', 1);

                        var fields = data.fields;
                        expect(fields.id.value).toBe(1);
                        expect(fields.name.value).toBe('Mizoute');
                        // Test value transformer
                        expect(fields.summary.value).toBe('A Cat-test');
                    });
            });
        });

        describe('getAll', function() {
            it('should return an error when we call a entity undefined in the config file.', function() {
                crudManager.getAll('book')
                    .then(function() {
                        expect(Error());
                    }, function (err) {
                        expect(err).toBe('Entity book not found.');
                    });
            });

            it('should return all objects from API & field definition.', function() {
                Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({
                    data: [
                        {"id":1,"title":"Mizu","summary":"First cat"},
                        {"id":2,"title":"Suna","summary":"Mini cat"},
                        {"id":3,"title":"Nao","summary":"Black cat"}
                    ],
                    headers: function() {}
                }));

                crudManager.getAll('cat')
                    .then(function(data) {
                        expect(Restangular.addResponseInterceptor).toHaveBeenCalled();
                        expect(data.entities.length).toBe(3);
                        expect(data.currentPage).toBe(1);
                        expect(data.entities[0].getField('summary').value).toBe("First cat-test");
                    });
            });

            it('should add sort params', function() {
                Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({
                    data: [],
                    headers: function() {}
                }));

                catEntity.sortParams(function(field, dir) {
                    return {
                        params:{
                            sort: field,
                            direction: dir
                        },
                        headers: {
                        }
                    }
                });

                crudManager.getAll('cat', 1, false, true, null, 'cat.name', 'DESC')
                    .then(function(data) {
                        expect(Restangular.getList.argsForCall[0][0]).toEqual({sort: 'name', direction: 'DESC'});
                    });
            });

            it('should add sort headers', function() {
                Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({
                    data: [],
                    headers: function() {}
                }));

                catEntity.sortParams(function(field, dir) {
                    return {
                        params:{
                        },
                        headers: {
                            sortField: field,
                            direction: dir
                        }
                    }
                });

                crudManager.getAll('cat', 1, false, true, null, 'cat.name', 'DESC')
                    .then(function(data) {
                        expect(Restangular.getList.argsForCall[0][1]).toEqual({sortField: 'name', direction: 'DESC'});
                    });
            });

            it('should add quick filters from callback', function() {
                Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({
                    data: [],
                    headers: function() {}
                }));

                catEntity.addQuickFilter('Today', function() {
                    return {
                        test: 'OK'
                    }
                });

                var filters = catEntity.getQuickFilterParams('Today');

                crudManager.getAll('cat', 1, false, true, null, null, null, filters)
                    .then(function(data) {
                        expect(Restangular.getList.argsForCall[0][0]).toEqual({test: 'OK'});
                    });
            });

            it('should add quick filters from callback', function() {
                Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({
                    data: [],
                    headers: function() {}
                }));

                catEntity.addQuickFilter('Static', {
                    'private': false
                });

                var filters = catEntity.getQuickFilterParams('Static');

                crudManager.getAll('cat', 1, false, true, null, null, null, filters)
                    .then(function(data) {
                        expect(Restangular.getList.argsForCall[0][0]).toEqual({private: false});
                    });
            });

            it('should add global query filter', function() {
                Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({
                    data: [],
                    headers: function() {}
                }));

                catEntity.filterQuery(function(q) {
                    return {
                        query: q
                    }
                });

                var filters = catEntity.getQuickFilterParams('Static');

                crudManager.getAll('cat', 1, false, true, 'hello')
                    .then(function(data) {
                        expect(Restangular.getList.argsForCall[0][0]).toEqual({query: 'hello'});
                    });
            });
        });

        describe('createOne', function() {
            it('should create a new object.', function() {
                var postData = {
                    name: "Mizu",
                    summary: "Cute cat"
                };

                crudManager.createOne('cat', postData);

                expect(Restangular.restangularizeElement).toHaveBeenCalledWith(null, postData, 'cat');
                expect(Restangular.post).toHaveBeenCalled();
            });
        });

        describe('updateOne', function() {
            it('should return an error when we call a entity undefined in the config file.', function() {
                crudManager.updateOne('book', {})
                    .then(function() {
                        expect(Error());
                    }, function (err) {
                        expect(err).toBe('Entity book not found.');
                    });
            });

            it('should update the object.', function() {
                var postData = {
                    name: "Mizu",
                    summary: "Cute cat"
                };

                crudManager.updateOne('cat', postData);

                expect(Restangular.restangularizeElement).toHaveBeenCalledWith(null, postData, 'cat');
                expect(Restangular.post).toHaveBeenCalled();
            });
        });

        describe('deleteOne', function() {
            it('should delete the object.', function() {
                crudManager.deleteOne('cat', 1);

                expect(Restangular.one).toHaveBeenCalledWith('cat', 1);
                expect(Restangular.remove).toHaveBeenCalled();
            });
        });

        describe('getReferences', function() {
            it('should returns all references of the object.', function() {
                var references = crudManager.getReferences('cat');

                expect('human_id' in references).toBe(true);
            });
        });

        describe('getReferenceChoices', function() {
            it('should return all choices for a reference', function() {
                var references = crudManager.getReferences('cat'),
                    entity1 = angular.copy(humanEntity),
                    entity2 = angular.copy(humanEntity);

                entity1.getField('name').value = 'Billy';
                entity1.getField('id').value = 8;

                entity2.getField('name').value = 'Joe';
                entity2.getField('id').value = 9;

                var choices = crudManager.getReferenceChoices(references['human_id'], [entity1, entity2]);

                expect(8 in choices).toBe(true);
                expect(choices[8]).toBe('Billy');
                expect(choices[9]).toBe('Joe');
            });
        });

        describe('getReferencedValues', function() {
            it('should returns all choices for all references of an entity.', function() {

                var entity1 = angular.copy(humanEntity),
                    entity2 = angular.copy(humanEntity);

                entity1.getField('name').value = 'Billy';
                entity1.getField('id').value = 8;

                entity2.getField('name').value = 'Joe';
                entity2.getField('id').value = 9;

                var responses = [{
                    entities:[entity1, entity2]
                }];

                $q.all = jasmine.createSpy('all').andReturn(mixins.buildPromise(responses));
                Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({
                    data: [],
                    headers: function() {}
                }));

                crudManager.getReferencedValues('cat')
                    .then(function(references){
                        expect(references.human_id.getChoices()[8]).toBe('Billy');
                        expect(references.human_id.getChoices()[9]).toBe('Joe');
                    });
            });
        });

        describe('getEditionFields', function() {
            it('should return all the entity fields.', function() {
                var data = crudManager.getEditionFields('cat'),
                    fields = data.fields;

                expect(Object.keys(fields)).toEqual([ 'id', 'name', 'summary', 'human_id' ]);
                expect(fields.id.label()).toBe('ID');
                expect(fields.name.label()).toBe('Name');
                expect(fields.summary.label()).toBe('Summary');
            });
        });

        describe('filterReferencedList', function() {
            it('should filter only referenced values', function() {
                var entities = [
                    angular.copy(catEntity),
                    angular.copy(catEntity),
                    angular.copy(catEntity)
                ];

                entities[0].getField('name').value = 'Mizu';
                entities[0].getField('human_id').value = 1;
                entities[1].getField('name').value = 'Suna';
                entities[1].getField('human_id').value = 1;
                entities[2].getField('name').value = 'Boby';
                entities[2].getField('human_id').value = 2;

                var results = crudManager.filterReferencedList(entities, referencedCats, 1);
                expect(results.length).toBe(2);
                expect(results[0].getField('name').value).toBe('Mizu');
                expect(results[1].getField('name').value).toBe('Suna');
            });
        });

        describe('truncateListValue', function() {
            it('should call truncateList for each field', function() {
                Restangular.getList = jasmine.createSpy('getList').andReturn(mixins.buildPromise({
                    data: [
                        {"id":1,"title":"Mizu","summary":"First cat"},
                        {"id":2,"title":"Suna","summary":"Mini cat"}
                    ],
                    headers: function() {}
                }));

                catSummary
                    .valueTransformer(function(value) {
                        return value;
                    })
                    .truncateList(function(value) {
                       return 'truncated : ' + value;
                    });


                crudManager.getAll('cat')
                    .then(function(data) {
                        expect(data.entities[0].getField('summary').value).toBe('truncated : First cat');
                        expect(data.entities[1].getField('summary').value).toBe('truncated : Mini cat');
                    });
            });
        });
    });
});
