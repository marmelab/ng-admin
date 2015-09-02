/*global describe,it,expect,$$,element,browser,by*/
describe('List filter', function () {
    'use strict';

    var hasToLoad = true;
    beforeEach(function() {
        if (hasToLoad) {
            browser.get(browser.baseUrl + '#/comments/list');    
        }
        hasToLoad = true;
    });

    describe('layout', function() {
        it('should display pinned filters by default in the listview', function() {
            $$('.filters .filter input').then(function(inputs) {
                expect(inputs.length).toBe(1); // Only text filter is pinned
                expect(inputs[0].getAttribute('placeholder')).toBe('Search');
            });
            hasToLoad = false;
        });
        it('should display a filter button for adding new filters', function() {
            return $$('ma-view-actions button').then(function(buttons) {
                expect(buttons[0].getText()).toBe(' Add filter');
            });
        });        
    });

    describe('filter button', function() {
        it('should display a list of filters when clicked', function() {
            element(by.css('ma-filter-button button')).click();
            $$('ma-filter-button ul').then(function(element) {
                expect(element[0].getCssValue('display')).toBe('block');
            });
            $$('ma-filter-button ul li').then(function(elements) {
                expect(elements.length).toBe(2);
                expect(elements[0].getText()).toBe('Posted');
                expect(elements[1].getText()).toBe('Post');
            });
            hasToLoad = false;
        });
        it('should add a filter when filter name is clicked', function() {
            $$('ma-filter-button ul li:nth-child(1) a').click();
            $$('.filters .filter input').then(function(inputs) {
                expect(inputs.length).toBe(2);
                expect(inputs[1].getAttribute('placeholder')).toBe('Filter by date');
            });
            hasToLoad = false;
        });
        it('should hide the list of filters once clicked', function() {
            $$('ma-filter-button ul').then(function(element) {
                expect(element[0].getCssValue('display')).toBe('none');
            });
            hasToLoad = false;
        });
        it('should reduce the number of filters in the dropdown once clicked', function() {
            element(by.css('ma-filter-button button')).click();
            $$('ma-filter-button ul').then(function(element) {
                expect(element[0].getCssValue('display')).toBe('block');
            });
            $$('ma-filter-button ul li').then(function(elements) {
                expect(elements.length).toBe(1);
                expect(elements[0].getText()).toBe('Post');
            });
            hasToLoad = false;
        });
        it('should disappear if all filters were added', function() {
            element(by.css('ma-filter-button ul li:nth-child(1) a')).click();
            $$('.filters .filter input').then(function(inputs) {
                expect(inputs.length).toBe(4); // Post is autocomplete, so it has 2 inputs
            });
            $$('ma-filter-button ul').then(function(elements) {
                expect(elements.length).toBe(0);
            });
            hasToLoad = false;
        });
        it('should reappear once an unpinned filter is removed', function() {
            element(by.css('.filters .filter:nth-child(3) .remove_filter a')).click();
            $$('ma-filter-button ul').then(function(elements) {
                expect(elements.length).not.toBe(0);
            });
            element(by.css('ma-filter-button button')).click();
            $$('ma-filter-button ul li').then(function(elements) {
                expect(elements.length).toBe(1);
                expect(elements[0].getText()).toBe('Post');
            });
        });
    });

    describe('text filter', function() {
        it('should filter globally', function () {
            // Filter globally for 'rabbit'
            $$('.filters .filter:nth-child(1) input').sendKeys('rabbit')
            .then(function() {
                return browser.driver.sleep(600); // debounce delay
            })
            .then(function() {
                return $$('.grid tr td:nth-child(4)');    
            })
            .then(function (tdElements) {
                expect(tdElements.length).toBe(1);
                expect(tdElements[0].getText()).toBe('White Rabbit: it was indeed: she was out of the gr...');
            });
            hasToLoad = false;
        });

        it('should update the pagination total', function () {
            $$('ma-datagrid-pagination .total').then(function (totalElements) {
                expect(totalElements[0].getText()).toBe('1 - 1 on 1');
            });
            hasToLoad = false;
        });

        it('should not filter when empty', function () {
            $$('.filters .filter:nth-child(1) input').clear()
            .then(function() {
                return browser.driver.sleep(600); // debounce delay
            })
            .then(function() {
                return $$('.grid tr td:nth-child(4)');    
            })
            .then(function (tdElements) {
                expect(tdElements.length).toBe(10);
            });
        });
    });

    describe('reference filter', function() {
        it('should filter on reference', function () {
            element(by.css('ma-filter-button button')).click();
            $$('ma-filter-button ul li:nth-child(2) a').click();
            // Filter on post_id '3' (Perspiciatis adipisci vero qui ipsam iure porro)
            element(by.css('.filters .ui-select-placeholder')).click();
            element(by.css('.filters .ui-select-search')).sendKeys('Perspi');
            element(by.css('#ui-select-choices-row-0-0')).click();
            browser.driver.sleep(600); // debounce delay
            $$('.grid tr td:nth-child(4)').then(function (tdElements) {
                expect(tdElements.length).toBe(2);
                expect(tdElements[0].getText()).toBe('I\'d been the whiting,\' said the Hatter, it woke up...');
                expect(tdElements[1].getText()).toBe('I\'m not Ada,\' she said, \'and see whether it\'s mark...');
            });
            hasToLoad = false;
        });

        it('should update the pagination total', function () {
            $$('ma-datagrid-pagination .total').then(function (totalElements) {
                expect(totalElements[0].getText()).toBe('1 - 2 on 2');
            });
        });
    });

    describe('interaction with pagination', function() {
        it('should reset page number', function () {
            // Filter globally for 'I'
            $$('.filters .filter:nth-child(1) input').sendKeys('I');
            browser.driver.sleep(700); // debounce delay
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
            browser.driver.sleep(700); // debounce delay
            $$('ma-datagrid-pagination .total').then(function (totalElements) {
                expect(totalElements[0].getText()).toBe('1 - 5 on 5');
            });
        });
    });
});
