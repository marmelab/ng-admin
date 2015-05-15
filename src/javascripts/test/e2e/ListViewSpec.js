/*global describe,it,expect,$$,element,browser,by*/
describe('ListView', function () {
    'use strict';

    beforeEach(function () {
        browser.get(browser.baseUrl + '#/posts/list');
    });

    describe('Edition link', function () {
        it('should allow edition of an entity', function () {
            // Retrieve first edit button
            $$('table tr:nth-child(1) ma-edit-button').then(function (buttons) {
                // Click on it
                buttons[0].click().then(function() {
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
            // Retrieve first edit button
            $$('table tr:nth-child(1) ma-show-button').then(function (buttons) {
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
