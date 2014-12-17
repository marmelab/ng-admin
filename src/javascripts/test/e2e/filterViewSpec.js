/*global describe,it,expect,$$,element,browser,by*/
describe('ng-admin', function () {
    'use strict';

    describe('Global filter', function () {
        browser.get(browser.baseUrl + '#/list/comments');

        it('should display filters uppon the listview', function () {
            $$('.filters .filter input').then(function (inputs) {
                expect(inputs.length).toBe(2);

                expect(inputs[0].getAttribute('placeholder')).toBe('Global Search');
                expect(inputs[1].getAttribute('placeholder')).toBe('Filter by date');
            });
        });

        it('should filter globally', function () {
            // Filter globally for 'rabbit'
            $$('.filters .filter:nth-child(1) input').sendKeys('rabbit');
            $$('.filters button[type="submit"]').click();

            $$('.grid tr td:nth-child(2)').then(function (tdElements) {
                expect(tdElements.length).toBe(1);

                expect(tdElements[0].getText()).toBe('THEN--she found herself in Wonderland, though she ...');
            });
        });

        it('should update the pagination total', function () {
            $$('datagrid-pagination .total').then(function (totalElements) {
                expect(totalElements[0].getText()).toBe('1 - 1 on 1');
            });
        });

        it('should reset all filters', function () {
            $$('.filters .glyphicon-remove').click();

            $$('datagrid-pagination .total').then(function (totalElements) {
                expect(totalElements[0].getText()).toBe('1 - 11 on 11');
            });
        });
    });
});
