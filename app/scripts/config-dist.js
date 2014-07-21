define([], function () {
    "use strict";

    return {
        "global": {
            "name": "Backend",
            "baseApiUrl": "http://192.168.56.10:8080/"
        },
        "entities": {
            "book" : {
                "label": "Book",
                "dashboard": 5,
                "fields": [
                    {
                        "name": "id",
                        "type": "integer",
                        "label": "ID",
                        "edition" : "read-only",
                        "order": 1,
                        "identifier" : true,
                        "list": true,
                        "dashboard": true,
                        "validation": {}
                    },
                    {
                        "name": "title",
                        "type": "text",
                        "label": "Title",
                        "edition" : "editable",
                        "order": 2,
                        "list": true,
                        "dashboard": true,
                        "validation": {
                            "required": true,
                            "max-length" : 150
                        }
                    },
                    {
                        "name": "summary",
                        "type": "text",
                        "label": "Summary",
                        "edition" : "editable",
                        "order": 3,
                        "dashboard" : false,
                        "validation": {
                            "required": true,
                            "max-length" : 500
                        }
                    },
                    {
                        "name": "genre",
                        "type": "text",
                        "label": "Genre",
                        "edition" : "editable",
                        "order": 4,
                        "dashboard" : false,
                        "validation": {
                            "required": true,
                            "max-length" : 255
                        }
                    }

                ]
            }
        }
    };
});
