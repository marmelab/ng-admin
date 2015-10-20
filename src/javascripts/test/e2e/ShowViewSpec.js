/*global describe,it,expect,$$,element,browser,by*/
describe('ShowView', function () {
    'use strict';

    var hasToLoad = true;
    beforeEach(function() {
        if (hasToLoad) {
            browser.get(browser.baseUrl + '#/posts/show/1');
            hasToLoad = false;
        }
    });

    describe('ChoiceField', function() {
        it('should render as a label when choices is an array', function () {
            $$('.ng-admin-field-category').then(function (fields) {
                expect(fields[0].getText()).toBe('Tech');
            });
        });
        it('should render as a label when choices is a function', function () {
            $$('.ng-admin-field-subcategory').then(function (fields) {
                expect(fields[0].getText()).toBe('Computers');
            });
        });
    });

    describe('ReferencedListField', function() {
        it('should render as a datagrid', function () {
            $$('.ng-admin-field-comments th')
            .then(function (inputs) {
                expect(inputs.length).toBe(4);
                expect(inputs[0].getAttribute('class')).toBe('ng-admin-column-id ng-admin-type-string');
                expect(inputs[1].getAttribute('class')).toBe('ng-admin-column-created_at ng-admin-type-string');
                expect(inputs[2].getAttribute('class')).toBe('ng-admin-column-body ng-admin-type-string');
            })
            .then(function() {
                return $$('.ng-admin-field-comments tbody tr');
            })
            .then(function (lines) {
                expect(lines.length).toBe(2);
            });
        });
    });

    describe('EmbeddedListField', function() {
        it('should render as a datagrid', function () {
            $$('.ng-admin-field-backlinks th').then(function (inputs) {
                expect(inputs.length).toBe(2);
                expect(inputs[0].getAttribute('class')).toBe('ng-admin-column-date ng-admin-type-datetime');
                expect(inputs[1].getAttribute('class')).toBe('ng-admin-column-url ng-admin-type-string');
            })
            .then(function() {
                return $$('.ng-admin-field-backlinks tbody tr');
            })
            .then(function (lines) {
                expect(lines.length).toBe(1);
            });
        });
    });

});
