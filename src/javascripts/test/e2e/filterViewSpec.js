/*global describe,it,expect,$$,element,browser,by*/
describe('Global filter', function () {
    'use strict';

    beforeEach(function() {
        browser.get(browser.baseUrl + '#/list/comments');
    });

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
        $$('.grid tr td:nth-child(3)').then(function (tdElements) {
            expect(tdElements.length).toBe(1);
            expect(tdElements[0].getText()).toBe('White Rabbit: it was indeed: she was out of the gr...');
        });
    });

    it('should update the pagination total', function () {
        // Filter globally for 'rabbit'
        $$('.filters .filter:nth-child(1) input').sendKeys('rabbit');
        $$('.filters button[type="submit"]').click();
        $$('ma-datagrid-pagination .total').then(function (totalElements) {
            expect(totalElements[0].getText()).toBe('1 - 1 on 1');
        });
    });

    it('should reset all filters', function () {
        // Filter globally for 'rabbit'
        $$('.filters .filter:nth-child(1) input').sendKeys('rabbit');
        $$('.filters button[type="submit"]').click();

        browser.wait(function () {
            return $('.filters > button[type="button"]').isDisplayed().then(function (result) {
                return result;
            });
        });
        $('.filters > button[type="button"]').click();

        $$('ma-datagrid-pagination .total').then(function (totalElements) {
            expect(totalElements[0].getText()).toBe('1 - 10 on 11');
        });
    });

    it('should filter on reference', function () {
        // Filter on post_id '3'
        $$('.filters .filter select option[value="3"]').click();
        $$('.filters button[type="submit"]').click();
        $$('.grid tr td:nth-child(3)').then(function (tdElements) {
            expect(tdElements.length).toBe(2);
            expect(tdElements[0].getText()).toBe('I\'d been the whiting,\' said the Hatter, it woke up...');
            expect(tdElements[1].getText()).toBe('I\'m not Ada,\' she said, \'and see whether it\'s mark...');
        });
    });

    it('should update the pagination total', function () {
        // Filter on post id '3'
        $$('.filters .filter select option[value="3"]').click();
        $$('.filters button[type="submit"]').click();
        $$('ma-datagrid-pagination .total').then(function (totalElements) {
            expect(totalElements[0].getText()).toBe('1 - 2 on 2');
        });
    });

    it('should reset page number', function () {
        // Filter globally for 'I'
        $$('.filters .filter:nth-child(1) input').sendKeys('I');
        $$('.filters button[type="submit"]').click();
        $$('ma-datagrid-pagination .total').then(function (totalElements) {
            expect(totalElements[0].getText()).toBe('1 - 10 on 11');
        });
        $$('ma-datagrid-pagination li:nth-child(3) a').click();
        $$('ma-datagrid-pagination .total').then(function (totalElements) {
            expect(totalElements[0].getText()).toBe('11 - 11 on 11');
        });
        // Filter globally for 'be'
        $$('.filters .filter:nth-child(1) input').clear();
        $$('.filters .filter:nth-child(1) input').sendKeys('be');
        $$('.filters button[type="submit"]').click();
        $$('ma-datagrid-pagination .total').then(function (totalElements) {
            expect(totalElements[0].getText()).toBe('1 - 5 on 5');
        });
    });
});
