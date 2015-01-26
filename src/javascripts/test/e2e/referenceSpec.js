/*global describe,it,expect,$$,element,browser,by*/
describe('Reference fields', function () {
    'use strict';

    describe('in ShowView', function () {
        beforeEach(function() {
            browser.get(browser.baseUrl + '#/show/posts/1');
        });

        it('should display ReferencedList as a datagrid', function () {
            $$('.ng-admin-field-comments th').then(function (inputs) {
                expect(inputs.length).toBe(2);

                expect(inputs[0].getAttribute('class')).toBe('ng-scope ng-admin-column-id');
                expect(inputs[1].getAttribute('class')).toBe('ng-scope ng-admin-column-body');
            });
        });
    });

    describe('in ListView', function () {
        beforeEach(function() {
            browser.get(browser.baseUrl + '#/show/posts/1');
        });

        it('should display ReferencedList as a datagrid', function () {
            $$('.ng-admin-field-comments th').then(function (inputs) {
                expect(inputs.length).toBe(2);

                expect(inputs[0].getAttribute('class')).toBe('ng-scope ng-admin-column-id');
                expect(inputs[1].getAttribute('class')).toBe('ng-scope ng-admin-column-body');
            });
        });
    });

});
