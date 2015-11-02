(function () {
    'use strict';

    // setup fake server
    var restServer = new FakeRest.Server('http://localhost:3000');
    var testEnv = window.location.pathname.indexOf('test.html') !== -1;
    restServer.init(apiData);
    restServer.setDefaultQuery(function(resourceName) {
        if (resourceName == 'posts') return { embed: ['comments'] }
        return {};
    });
    restServer.toggleLogging(); // logging is off by default, enable it

    var server = sinon.fakeServer.create();
    server.autoRespond = true;
    server.autoRespondAfter = 0; // answer immediately

    server.respondWith(restServer.getHandler());

    if (testEnv) {
        server.respondWith(function (response) {
            if (response.url.indexOf('/upload') !== -1) {
                response.respond(JSON.stringify({apifilename: 'my-cat.jpg'}));
            }
        });
    }

    // use sinon.js to monkey-patch XmlHttpRequest
    sinon.FakeXMLHttpRequest.useFilters = true;
    sinon.FakeXMLHttpRequest.addFilter(function (method, url) {
        // do not fake other urls than http://localhost:3000/*
        return url.indexOf(restServer.baseUrl) === -1;
    });
}());
