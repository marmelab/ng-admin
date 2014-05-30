/*global describe,module,beforeEach,inject,it,expect*/

describe("Service: configRetriever", function() {
    'use strict';

    var configRetriever,
        $httpBackend;

    beforeEach(module('angularAdminApp'));

    beforeEach(inject(function ($injector) {
        configRetriever = $injector.get('configRetriever');

        // mock http service responses
        $httpBackend = $injector.get('$httpBackend');

        $httpBackend.when('GET', '/config/config.json').respond({
            "config": {
                "name": "Cats",
                "baseApiUrl": "http://192.168.56.10:8080/"
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

    }));

    it('should contain a configRetriever service', function() {
        var self = this;

        configRetriever()
            .then(function(data) {
                expect(data.config.name).toBe("Cats");
            }, function () {
                self.fail(Error());
            });

        $httpBackend.flush();
    });
})


