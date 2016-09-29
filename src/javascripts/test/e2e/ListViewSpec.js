/*global describe,it,expect,$,$$,element,browser,by*/
describe('ListView', function () {
    'use strict';

    beforeEach(function () {
        browser.get(browser.baseUrl + '#/posts/list');
    });

    describe('Edition link', function () {
        it('should allow edition of an entity', function () {
            // Retrieve first edit button
            $('table tr:nth-child(1) ma-edit-button a').click();

            // Check browser URL
            browser.getLocationAbsUrl().then(function(url) {
                expect(url).toContain('/posts/edit/');
            });
        });
    });

    describe('Show link', function () {
        it('should allow display of an entity', function () {
            // Retrieve first edit button
            $('table tr:nth-child(1) ma-show-button a').click();

            // Check browser URL
            browser.getLocationAbsUrl().then(function(url) {
                expect(url).toContain('/posts/show/');
            });
        });
    });

    describe('ma-list-button', function () {
        var listUrl;

        beforeEach(function() {
            listUrl = encodeURI(browser.baseUrl + '/#/comments/list?search={"post_id":"9"}');
            browser.get(listUrl);
        });

        it('should restore the list with filter when used from edit', function () {
            browser.executeScript('window.scrollTo(810, 481)').then(function () {
                return $$('ma-edit-button a');
            }).then(function (elements) {
                expect(elements[0].getText()).toBe(' Edit');
                return elements[0].click();
            }).then(function() {
                expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/comments/edit/2');
                return $$('ma-list-button a');
            }).then(function (elements) {
                return elements[0].click();
            }).then(function() {
                expect(browser.getCurrentUrl()).toBe(listUrl);
            });
        });

        it('should restore the list with filter after delete confirmation', function () {
            browser.executeScript('window.scrollTo(810, 481)').then(function () {
                return $$('ma-delete-button a');
            }).then(function (elements) {
                expect(elements[0].getText()).toBe(' Delete');
                return elements[0].click();
            }).then(function() {
                expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/comments/delete/2');
                return $$('button.btn-danger');
            }).then(function (elements) {
                return elements[0].click();
            }).then(function() {
                expect(browser.getCurrentUrl()).toBe(listUrl);
            });
        });

        it('should restore the list with filter after delete cancel', function () {
            browser.executeScript('window.scrollTo(810, 481)').then(function () {
                return $$('ma-delete-button a');
            }).then(function (elements) {
                expect(elements[0].getText()).toBe(' Delete');
                return elements[0].click();
            }).then(function() {
                expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/comments/delete/2');
                return $$('button.btn-default');
            }).then(function (elements) {
                return elements[0].click();
            }).then(function() {
                expect(browser.getCurrentUrl()).toBe(listUrl);
            });
        });
    });

    function selectItemAndGoToBatchDelete() {
        return $$('ma-view-batch-actions button')
        .then(function (elements) {
            expect(elements.length).toBe(0);
            return $$('ma-datagrid-item-selector');
        })
        .then(function (elements) {
            // expect(elements.length).toBe(numComments);
            elements[0].click();

            return $$('ma-view-batch-actions button');
        })
        .then(function (elements) {
            expect(elements.length).toBe(1);
            elements[0].click();
            return $$('ma-batch-delete-button');
        })
        .then(function (elements) {
            expect(elements.length).toBe(1);
            elements[0].click();
            expect(browser.getCurrentUrl()).toMatch(browser.baseUrl + '/#/comments/batch-delete/');

            return $$('#page-wrapper button');
        });
    }

    describe('ma-batch-delete-button', function () {
        it('should show the batch delete button only when at least one line is selected', function () {
            browser.get('/#/comments/list');
            var numComments;
            $$('tbody tr').then(function (elements) {
                numComments = elements.length;
                return selectItemAndGoToBatchDelete();
            })
            .then(function (elements) {
                expect(elements[1].getText()).toBe('No');
                elements[1].click();
                expect(browser.getCurrentUrl()).toMatch(browser.baseUrl + '/#/comments/list');
                return $$('tbody tr');
            })
            .then(function (elements) {
                expect(elements.length).toBe(numComments);
            });
        });

        // @TODO allow to delete item without broking other test
        xit('should show the batch delete button only when at least one line is selected', function () {
            browser.get('/#/comments/list');
            var numComments;
            $$('tbody tr').then(function (elements) {
                numComments = elements.length;
                return selectItemAndGoToBatchDelete();
            })
            .then(function (elements) {
                expect(elements[0].getText()).toBe('Yes');
                elements[0].click();
                expect(browser.getCurrentUrl()).toMatch(browser.baseUrl + '/#/comments/list');
                return $$('tbody tr');
            })
            .then(function (elements) {
                expect(elements.length).toBe(numComments - 1);
            });
        });
    });

    describe('prepare', function() {
        it('should execute after the resolve and before the controller', function() {
            browser.get('/#/tags/list')
                .then(function() {
                    return $$('td.ng-admin-column-nb_posts').first();
                })
                .then(function(element) {
                    expect(element.getText()).toBe('2');
                });
        });
    });

    describe('entryCssClasses', function() {
        it('set the class to the entire row according to the entry', function() {
            $$('tbody tr')
            .then(function(rows) {
                expect(rows[0].getAttribute('class')).toBe('ng-scope is-popular');
                expect(rows[1].getAttribute('class')).toBe('ng-scope');
            });
        });
    });

    describe('translate', () => {
        it('should not escape HTML characters', () => {
            const title = $$('tbody tr:last-child .ng-admin-column-title').first();

            // If this title is escaped, it will be:
            // Accusantium qui nihil &amp; voluptatum quia voluptas maxime ab similique
            expect(title.getText()).toBe('Accusantium qui nihil & voluptatum quia voluptas maxime ab similique');
        });
    });
});
