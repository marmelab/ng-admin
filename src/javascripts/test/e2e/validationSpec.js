/*global describe,it,expect,$$,element,browser,by*/
describe('Form validation', function () {
    'use strict';

    describe('Creation Form', function () {
        beforeEach(function () {
            browser.get(browser.baseUrl + '#/create/posts');
        });

        it('should not display any validation status before entering data', function () {
            var enclosingDiv = element.all(by.css('.has-feedback')).first();
            expect(enclosingDiv.getAttribute('class')).toBe('has-feedback');
        });

        it('should display correct validation status once data is entered', function () {
            var input = element.all(by.css('input')).first();
            var enclosingDiv = element.all(by.css('.has-feedback')).first();
            input.sendKeys('ra');
            expect(enclosingDiv.getAttribute('class')).toBe('has-feedback has-error');
            input.sendKeys('rabisudbfij');
            expect(enclosingDiv.getAttribute('class')).toBe('has-feedback has-success');
        });
    });

    describe('Edition Form', function() {
        beforeEach(function() {
            browser.get(browser.baseUrl + '#/edit/posts/1');
        });

        it('should not display any validation status before entering data', function () {
            var enclosingDiv = element.all(by.css('.has-feedback')).first();
            expect(enclosingDiv.getAttribute('class')).toBe('has-feedback');
        });

        it('should display correct validation status once data is entered', function () {
            var input = element.all(by.css('input')).first();
            var enclosingDiv = element.all(by.css('.has-feedback')).first();
            input.clear();
            input.sendKeys('ra');
            expect(enclosingDiv.getAttribute('class')).toBe('has-feedback has-error');
            input.sendKeys('rabisudbfij');
            expect(enclosingDiv.getAttribute('class')).toBe('has-feedback has-success');
        });
    });

});
