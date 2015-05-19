/*global xdescribe,xit,expect,$$,element,browser,by*/
xdescribe('ListView', function () {
    'use strict';

    beforeEach(function () {
        browser.get(browser.baseUrl + '#/posts/list');
    });

    xdescribe('Edition link', function () {
        xit('should allow edition of an entity', function () {
            // Retrieve first edit button
            $('table tr:nth-child(1) ma-edit-button a').click();

            // Check browser URL
            browser.getLocationAbsUrl().then(function(url) {
                expect(url).toContain('/posts/edit/');
            });
        });
    });

    xdescribe('Show link', function () {
        xit('should allow display of an entity', function () {
            // Retrieve first edit button
            $('table tr:nth-child(1) ma-show-button a').click();

            // Check browser URL
            browser.getLocationAbsUrl().then(function(url) {
                expect(url).toContain('/posts/show/');
            });
        });
    });
});
