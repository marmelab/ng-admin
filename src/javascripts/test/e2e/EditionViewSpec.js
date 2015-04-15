/*global describe,it,expect,$$,element,browser,by*/
describe('EditionViews', function () {
    'use strict';

    var hasToLoad = true;
    beforeEach(function() {
        if (hasToLoad) {
            browser.get(browser.baseUrl + '#/posts/edit/1');
            hasToLoad = false;
        }
    });

    describe('ChoiceField', function() {

        it('should render as a dropdown when choices is an array', function () {
            $$('.ng-admin-field-category select option').then(function (options) {
                expect(options[1].getText()).toBe('Tech');
                expect(options[1].getAttribute('selected')).toBe('true');
                expect(options[2].getText()).toBe('Lifestyle');
            });
        });

        it('should render as a dropdown when choices is a function', function () {
            $$('.ng-admin-field-subcategory select option').then(function (options) {
                expect(options[1].getText()).toBe('Computers');
                expect(options[1].getAttribute('selected')).toBe('true');
                expect(options[2].getText()).toBe('Gadgets');
            });
        });

    });

});
