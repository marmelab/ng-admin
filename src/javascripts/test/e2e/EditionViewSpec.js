/*global describe,it,expect,$$,element,browser,by*/
describe('EditionView', function () {
    'use strict';

    beforeEach(function() {
        browser.get(browser.baseUrl);
    });

    describe('Fields mapping', function() {

        it('should map nested fields from the REST response', function () {
            browser.setLocation('/comments/edit/11')
            .then(function() {
                return $$('.ng-admin-field-author_name input');
            })
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
                return browser.setLocation('/comments/edit/11');
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

        it('should render correctly choice fields', function () {
            browser.setLocation('/posts/edit/1')
            .then(function() {
                return $$('.ng-admin-field-category .ui-select-container');
            })
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

    describe('BooleanField', function() {
        it('should render as a checkbox field when required', function () {
            browser.setLocation('/tags/edit/5')
            .then(function() {
                return $$('.ng-admin-field-published input[type="checkbox"]');
            })
            .then(function(checkboxes) {
                expect(checkboxes.length).toBe(1);
                return checkboxes[0];
            })
            .then(function(checkbox) {
                expect(checkbox.getAttribute('checked')).toBe('true');
                return checkbox.click();
            })
            .then(function() {
                return $$('button[type="submit"]').first().click();
            })
            .then(function() {
                browser.setLocation('/tags/edit/5')
            })
            .then(function() {
                return $$('.ng-admin-field-published input[type="checkbox"]').first();
            })
            .then(function(checkbox) {
                expect(checkbox.getAttribute('checked')).toBe(null);
            })
        });
    })

    describe('EmbeddedListField', function() {
        beforeEach(function() {
            browser.setLocation('/posts/edit/1');
        });

        it('should render as a list of subforms', function () {
            $$('.ng-admin-field-backlinks ng-form')
            .then(function subFormsExist(subforms) {
                expect(subforms.length).toBe(1);
            })
            .then(function getUrlInput() {
                return $$('.ng-admin-field-backlinks ng-form input#url').first();
            })
            .then(function urlInputContainsUrl(input) {
                expect(input.getAttribute('value')).toBe('http://example.com/bar/baz.html');
            });
        });
    })

    describe('DetailLink', function() {
        beforeEach(function() {
            browser.setLocation('/posts/edit/1');
        });

        it('should redirect to corresponding detail view even for referenced_list entity', function () {
            $$('#row-comments td a').first().click()
            .then(function() {
                return browser.getLocationAbsUrl();
            })
            .then(function(url) {
                expect(url).toContain('/comments/edit/');
            });
        });
    });

    describe('Field template', function() {
        beforeEach(function() {
            browser.setLocation('/posts/edit/1');
        });

        it('should execute the template when the entry changes', function() {
            $$('.ng-admin-field-subcategory')
            .then(function subcategoryFieldIsDisplayed(subcategoryField) {
                expect(subcategoryField.length).toBe(1);
            })
            .then(function emptyMainCategory() {
                return $$('.ng-admin-field-category a').first().click();
            })
            .then(function selectSubcategoryField() {
                return $$('.ng-admin-field-subcategory');
            })
            .then(function subcategoryFieldIsHidden(subcategoryField) {
                expect(subcategoryField.length).toBe(0);
            });
        });
    });
});
