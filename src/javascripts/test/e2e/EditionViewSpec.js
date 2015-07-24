/*global describe,it,expect,$$,element,browser,by*/
describe('EditionView', function () {
    'use strict';

    describe('Fields mapping', function() {

        beforeEach(function() {
            browser.get(browser.baseUrl + '#/comments/edit/11');
        });

        it('should map nested fields from the REST response', function () {
            $$('.ng-admin-field-author_name input')
            .then(function (inputs) {
                expect(inputs.length).toBe(1);
                expect(inputs[0].getAttribute('value')).toBe('Logan Schowalter');
                return inputs[0];
            })
            .then(function(input) {
                return input.sendKeys('r');
            })
            .then(function() {
                return $$('button[type="submit"]').first().click();
            })
            .then(function() {
                return browser.get(browser.baseUrl + '#/comments/list');     
            })
            .then(function() {
                return browser.get(browser.baseUrl + '#/comments/edit/11');
            })
            .then(function() {
                return $$('.ng-admin-field-author_name input').first();
            })
            .then(function (input) {
                expect(input.getAttribute('value')).toBe('Logan Schowalterr');
                // the data was modified in the server, we need to change it back to its original value
                return input;
            })
            .then(function(input) {
                return input.sendKeys("\b");
            })
            .then(function() {
                return $$('button[type="submit"]').first().click();
            });
        });
    })

    describe('ChoiceField', function() {

        beforeEach(function() {
            browser.get(browser.baseUrl + '#/posts/edit/1');
        });

        it('should render correctly choice fields', function () {
            $$('.ng-admin-field-category .ui-select-container')
            .then(function(uiSelect) {
                expect(uiSelect.length).toBe(1)
            })
            .then(function() {
                return $$('.ng-admin-field-category .btn').first().click();
            })
            .then(function() {
                return $$('.ng-admin-field-category .ui-select-choices-row');
            })
            .then(function(choices) {
                expect(choices.length).toBe(2)
            });
        });
    });

    describe('DetailLink', function() {
        beforeEach(function() {
            browser.baseUrl + '#/posts/edit/1';
        });

        it('should redirect to corresponding detail view even for referenced_list entity', function () {
            $$('#row-comments td a').first().click();
            browser.getLocationAbsUrl().then(function(url){
                expect(url).toContain('/comments/edit/');
            });
        });
    });
});
