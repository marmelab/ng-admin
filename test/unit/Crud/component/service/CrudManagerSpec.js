/*global require,describe,module,beforeEach,inject,it,expect*/

define('config', null);

define([
    'app/Crud/component/service/CrudManager',
    'lib/config/Application',
    'lib/config/Entity',
    'lib/config/Field',
    'lib/config/Reference',
    'mixins',
    'mock/q',
    'mock/Restangular'
], function(CrudManager, Application, Entity, Field, Reference, mixins, $q, Restangular) {
    'use strict';

    describe("Service: CrudManager", function() {
        var crudManager,
            catEntity,
            humanEntity;

        beforeEach(function() {
            humanEntity = Entity('human')
                .addField(Field('id').identifier(true).label('ID').edition('read-only'))
                .addField(Field('name').label('Name'));

            catEntity = Entity('cat')
                .addField(Field('id').label('ID').edition('read-only'))
                .addField(Field('name').label('Name'))
                .addField(Field('summary').label('Summary'))
                .addField(Reference('human_id').targetEntity(humanEntity).targetLabel('name'));

            var config = Application('test')
                .addEntity(catEntity)
                .addEntity(humanEntity);

            crudManager = new CrudManager($q, Restangular, config);
        });

        describe('getOne', function() {
            it('should return an the entity with only the editable fields.', function() {

                Restangular.get = jasmine.createSpy('get').andReturn(mixins.buildPromise({
                    data: {
                        "id":1,
                        "name":"Mizoute",
                        "summary":"Architecto quos et aut reprehenderit iste."
                    }
                }));

                crudManager.getOne('cat', 1)
                    .then(function(data) {
                        expect(Restangular.one).toHaveBeenCalledWith('cat', 1);

                        var fields = data.fields;
                        expect(fields.id.getValue()).toBe(1);
                        expect(fields.name.getValue()).toBe('Mizoute');
                        expect(fields.summary.getValue()).toBe('Architecto quos et aut reprehenderit iste.');
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
                        {"id":1,"title":"Mizu","summary":"Architecto quos et aut reprehenderit iste. Iure nihil maiores nostrum ea est dolorem eos. Sit saepe impedit vero voluptas id. Blanditiis nulla sit cupiditate."},
                        {"id":2,"title":"Suna","summary":"Modi quos recusandae magni dolore voluptas assumenda occaecati. Enim culpa soluta laborum incidunt sint."},
                        {"id":3,"title":"Nao","summary":"Consequatur praesentium dolorum."}
                    ],
                    headers: function() {}
                }));

                crudManager.getAll('cat')
                    .then(function(data) {
                        expect(data.rawItems.length).toBe(3);
                        expect(data.currentPage).toBe(1);
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
                var references = crudManager.getReferences('cat');

                var choices = crudManager.getReferenceChoices(references['human_id'], [
                    {'name': 'Billy', 'last_name': 'The kid', id: 8},
                    {'name': 'Joe', 'last_name': 'Dalton', id: 9}
                ]);

                expect(8 in choices).toBe(true);
                expect(choices[8]).toBe('Billy');
                expect(choices[9]).toBe('Joe');
            });
        });


        describe('getReferencedValues', function() {
            it('should returns all choices for all references of an entity.', function() {

                var responses = [{
                    rawItems:[
                        {'name': 'Billy', 'last_name': 'The kid', id: 8},
                        {'name': 'Joe', 'last_name': 'Dalton', id: 9}
                    ]
                }];

                $q.all = jasmine.createSpy('all').andReturn(mixins.buildPromise(responses));

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
