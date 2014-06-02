/*global describe,module,beforeEach,inject,it,expect*/

describe("Service: getConfig", function() {
    'use strict';

    var getConfig,
        $httpBackend;

    beforeEach(module('angularAdminApp'));

    beforeEach(inject(function ($injector) {
        getConfig = $injector.get('getConfig');

        // mock http service responses
        $httpBackend = $injector.get('$httpBackend');

        $httpBackend.when('GET', '/config/config.json').respond({
            "global": {
                "name": "Cats",
                "baseApiUrl": "http://localhost/"
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

    it('should contain a getConfig service', function() {
        var self = this;

        getConfig()
            .then(function(data) {
                expect(data.global.name).toBe("Cats");
            }, function () {
                self.fail(Error());
            });

        $httpBackend.flush();
    });
})


