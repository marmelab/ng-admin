/*global describe,it,expect,$$,element,browser,by*/
describe('EditionView', function () {
    'use strict';

    describe('Fields mapping', function() {

        beforeEach(function() {
            browser.get(browser.baseUrl + '#/comments/edit/11');
        });

        it('should map nested fields from the REST response', function () {
            $$('.ng-admin-field-author_name input').then(function (inputs) {
                expect(inputs.length).toBe(1);
                expect(inputs[0].getAttribute('value')).toBe('Logan Schowalter');
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
});
