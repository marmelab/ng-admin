(function () {
    'use strict';

    // setup fake server
    var restServer = new FakeRest.Server('http://localhost:3000');
    var testEnv = window.location.pathname.indexOf('test.html') !== -1;
    restServer.init(apiData);
    restServer.toggleLogging(); // logging is off by default, enable it

    // use sinon.js to monkey-patch XmlHttpRequest
    sinon.FakeXMLHttpRequest.useFilters = true;
    sinon.FakeXMLHttpRequest.addFilter(function (method, url) {
        // Do not catch webpack sync, config.js transformation but catch /upload in test env
        return url.indexOf('/socket.io/') !== -1 || url.indexOf('config.js') !== -1
            || (!testEnv && url.indexOf('/upload') !== -1);
    });

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
}());
