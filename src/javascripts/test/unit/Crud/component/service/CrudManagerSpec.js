/*global require,describe,module,beforeEach,inject,it,expect*/

define(function(require) {
    'use strict';

    var CrudManager = require('ng-admin/Crud/component/service/CrudManager'),
        Application = require('ng-admin/Main/component/service/config/Application'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        mixins = require('mixins'),
        $q = require('mock/q'),
        Restangular = require('mock/Restangular');

    describe("Service: CrudManager", function() {
        var crudManager,
            catEntity,
            humanEntity;

        beforeEach(function() {
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
                .addField(new Field('name').label('Name'));

            catEntity = new Entity('cat')
                .interceptor(function(data, operation, what, url, response, deferred){
                    data.push({id: 9, name: 'ninja', summary: 'Ninja cat !'});
                    return data;
                })
                .addField(new Field('id').label('ID').edition('read-only'))
                .addField(new Field('name').label('Name'))
                .addField(new Field('summary').label('Summary').valueTransformer(function(value) {
                    return value + "-test";
                }))
                .addField(new Reference('human_id').targetEntity(humanEntity).targetLabel('name'));

            var rawConfig = new Application('test')
                .addEntity(catEntity)
                .addEntity(humanEntity);

            var config = function() {
                return rawConfig;
            };

            crudManager = new CrudManager($q, Restangular, config);
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

        describe('getOne', function() {
            it('should return an the entity with only the editable fields.', function() {
                Restangular.addResponseInterceptor =  jasmine.createSpy('addResponseInterceptor');
                Restangular.get = jasmine.createSpy('get').andReturn(mixins.buildPromise({
                    data: {
                        "id":1,
                        "name":"Mizoute",
                        "summary":"A Cat"
                    }
                }));

                crudManager.getOne('cat', 1)
                    .then(function(data) {
                        expect(Restangular.addResponseInterceptor).toHaveBeenCalled();
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
                Restangular.addResponseInterceptor =  jasmine.createSpy('addResponseInterceptor');
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

            it('should return only the editable fields with a second parameter set to `editable`.', function() {
                var data = crudManager.getEditionFields('cat', 'editable'),
                    fields = data.fields;

                expect(Object.keys(fields)).toEqual([ 'name', 'summary', 'human_id' ]);
                expect(fields.name.label()).toBe('Name');
                expect(fields.summary.label()).toBe('Summary');
            });
        });
    });
});
