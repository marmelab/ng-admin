/*global describe,it,expect,$$,element,browser,by*/
describe('ListView', function () {
    'use strict';

    beforeEach(function() {
        browser.get(browser.baseUrl + '#/posts/list');
    });

    describe('Edition link', function () {
        it('should allow edition of an entity', function () {
            // Retrieve first edit button
            $$('table tr:nth-child(1) a.btn').then(function (buttons) {
                // Click on it
                buttons[1].click().then(function() {
                    // Check browser URL
                    browser.getLocationAbsUrl().then(function(url) {
                        expect(url).toContain('/posts/edit/');
                    });
                });
            });
        });
    });

    describe('Show link', function () {
        it('should allow display of an entity', function () {
            // Retrieve first show button
            $$('table tr:nth-child(1) a.btn').then(function (buttons) {
                // Click on it
                buttons[0].click().then(function() {
                    // Check browser URL
                    browser.getLocationAbsUrl().then(function(url) {
                        expect(url).toContain('/posts/show/');
                    });
                });
            });
        });
    });
});
