/*global describe,module,beforeEach,inject,it,expect*/

describe("Service: crudManager", function() {
    'use strict';

    var $q,
        $rootScope,
        crudManager,
        getConfig,
        $httpBackend;

    beforeEach(module('angularAdminApp'));

    beforeEach(function () {
        getConfig = function() {
            var deferred = $q.defer();

            deferred.resolve({
                "global": {
                    "name": "Cats",
                    "baseApiUrl": "http://fake-host/"
                },
                "entities": {
                    "cat" : {
                        "label": "Cats",
                        "dashboard": 5,
                        "fields": {
                            "id": {
                                "type": "integer",
                                "label": "ID",
                                "edition" : "read-only",
                                "list": true,
                                "dashboard": true,
                                "validation": {}
                            },
                            "name": {
                                "type": "text",
                                "label": "Name",
                                "edition" : "editable",
                                "list": true,
                                "dashboard": true,
                                "validation": {
                                    "required": true,
                                    "max-length" : 150
                                }
                            },
                            "summary": {
                                "type": "text",
                                "label": "Summary",
                                "edition" : "editable",
                                "dashboard" : false,
                                "validation": {
                                    "required": true,
                                    "max-length" : 500
                                }
                            }
                        }
                    }
                }
            });

            return deferred.promise;
        };

        module(function ($provide) {
            $provide.value('getConfig', getConfig);
        });
    });

    beforeEach(inject(function ($injector) {
        $q = $injector.get('$q');
        crudManager = $injector.get('crudManager');
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
    }));

    describe('getOne', function() {
        it('should return an the entity with only the editable fields.', function() {
            $httpBackend.when('GET', 'http://fake-host/cat/1').respond({
                "id":1,
                "name":"Mizoute",
                "summary":"Architecto quos et aut reprehenderit iste."
            });

            crudManager.getOne('cat', 1)
                .then(function(data) {
                    var fields = data.fields;
                    expect(fields.id.value).toBe(1);
                    expect(fields.name.value).toBe('Mizoute');
                    expect(fields.summary.value).toBe('Architecto quos et aut reprehenderit iste.');
                });

            $rootScope.$digest();
            $httpBackend.flush();
        });
    });


    describe('getEditionFields', function() {
        it('should return all the entity fields.', function() {
            crudManager.getEditionFields('cat')
                .then(function(data) {
                    var fields = data.fields;
                    expect(Object.keys(fields)).toEqual([ 'id', 'name', 'summary' ]);
                    expect(fields.id.label).toBe('ID');
                    expect(fields.name.label).toBe('Name');
                    expect(fields.summary.label).toBe('Summary');
                });

            $rootScope.$digest();
        });

        it('should return only the editable fields with a second parameter set to `editable`.', function() {
            crudManager.getEditionFields('cat', 'editable')
                .then(function(data) {
                    var fields = data.fields;
                    expect(Object.keys(fields)).toEqual([ 'name', 'summary' ]);
                    expect(fields.name.label).toBe('Name');
                    expect(fields.summary.label).toBe('Summary');
                });

            $rootScope.$digest();
        });
    });


    describe('getAll', function() {
        it('should return an error when we call a entity undefined in the config file.', function() {
            $httpBackend.when('GET', 'http://fake-host/book').respond(404, '');

            crudManager.getAll('book')
                .then(function(data) {
                    expect(Error());
                }, function (err) {
                    expect(err).toBe('Entity book not found.');
                });

            $rootScope.$digest();
        });

        it('should return all objects from API & field definition.', function() {

            $httpBackend.when('GET', 'http://fake-host/cat').respond([
                {"id":1,"title":"Mizu","summary":"Architecto quos et aut reprehenderit iste. Iure nihil maiores nostrum ea est dolorem eos. Sit saepe impedit vero voluptas id. Blanditiis nulla sit cupiditate."},
                {"id":2,"title":"Suna","summary":"Modi quos recusandae magni dolore voluptas assumenda occaecati. Enim culpa soluta laborum incidunt sint."},
                {"id":3,"title":"Nao","summary":"Consequatur praesentium dolorum."}
            ]);

            crudManager.getAll('cat')
                .then(function(data) {
                    expect(data.gridOptions.data.length).toBe(3);

                    var columns = data.gridOptions.columnDefs;
                    expect(columns.length).toBe(2);
                    expect(columns[0].field).toBe('id');
                    expect(columns[1].field).toBe('name');
                });

            $rootScope.$digest();
            $httpBackend.flush();
        });
    });


    describe('createOne', function() {
        it('should create a new object.', function() {

            var postData = {
                name: "Mizu",
                summary: "Cute cat"
            };

            $httpBackend.expectPOST('http://fake-host/cat', JSON.stringify(postData)).respond(200);

            crudManager.createOne('cat', postData);

            $httpBackend.flush();
        });
    });


    describe('deleteOne', function() {
        it('should delete the object.', function() {
            $httpBackend.expectDELETE('http://fake-host/cat/1').respond(200);

            crudManager.deleteOne('cat', 1);

            $httpBackend.flush();
        });
    });
});
