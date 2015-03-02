/*global describe,it,expect,$$,element,browser,by*/
describe('Pagination', function () {
    'use strict';

    beforeEach(function() {
        browser.get(browser.baseUrl + '#/list/comments');
    });

    describe('informations', function() {
        it('should display a pagination nav with content range', function () {
            $$('ma-datagrid-pagination .total').then(function (totalElements) {
                expect(totalElements[0].getText()).toBe('1 - 10 on 11');
            });
        });

        it('should display a pagination nav with pagination buttons', function () {
            $$('ma-datagrid-pagination .pagination li').then(function (liElements) {
                expect(liElements[0].getText()).toBe('');
                expect(liElements[1].getText()).toBe('1');
                expect(liElements[1].getAttribute('class')).toBe('ng-scope active');
                expect(liElements[2].getText()).toBe('2');
                expect(liElements[3].getText()).toBe('Next »');
            });
        });
    });

    describe('page change', function() {
        it('should allow page navigation', function() {
            $$('ma-datagrid-pagination li:nth-child(3) a').click();
            $$('ma-datagrid-pagination .total').then(function (totalElements) {
                expect(totalElements[0].getText()).toBe('11 - 11 on 11');
            });
            $$('ma-datagrid-pagination .pagination li').then(function (liElements) {
                expect(liElements[2].getAttribute('class')).toBe('ng-scope active');
            });
        })
    })

});
