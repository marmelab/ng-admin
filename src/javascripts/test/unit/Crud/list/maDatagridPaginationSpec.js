/*global define,angular,inject,describe,it,expect,beforeEach,module*/

define(function (require) {
    'use strict';

    describe('directive: ma-datagrid-pagination', function () {
        var directive = require('ng-admin/Crud/list/maDatagridPagination'),
            $compile,
            scope,
            directiveUsage = '<ma-datagrid-pagination page="{{ page }}" total-items="{{ totalItems }}" per-page="{{ itemsPerPage }}" ' +
                'nextPage="nextPage" infinite="infinite"></ma-datagrid-pagination>';

        angular.module('testapp_DatagridPagination', [])
            .directive('maDatagridPagination', directive);

        require('angular-mocks');

        beforeEach(module('testapp_DatagridPagination'));

        beforeEach(inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            scope = _$rootScope_;
        }));

        describe('with finite pagination', function() {
            beforeEach(function() {
                scope.infinite = false;
            });

            describe('total display', function() {
                it('should just display that no records have been found if no item fetched', function() {
                    scope.totalItems = 0;
                    var element = $compile(directiveUsage)(scope)[0];
                    scope.$digest();

                    var totalElement = element.querySelector('.pagination-bar .total');
                    expect(totalElement.innerText.trim()).toBe('No record found.');
                });

                it('should display the current data range', function() {
                    scope.totalItems = 37;
                    scope.itemsPerPage = 10;

                    function checkTotalText(page, expectedText) {
                        scope.page = page;
                        var element = $compile(directiveUsage)(scope)[0];
                        scope.$digest();

                        var totalElement = element.querySelector('.pagination-bar .total');
                        expect(totalElement.innerText.trim()).toBe(expectedText);
                    }

                    checkTotalText(-1, '1 - 10 on 37');     // Lower pages should be considered as page 1
                    checkTotalText( 0, '1 - 10 on 37');
                    checkTotalText( 1, '1 - 10 on 37');
                    checkTotalText( 2, '11 - 20 on 37');
                    checkTotalText( 3, '21 - 30 on 37');
                    checkTotalText( 4, '31 - 37 on 37');
                    checkTotalText( 8, '31 - 37 on 37');    // Higher pages should be considered as last page
                });
            });

            it('should display prev link except on the first one', function() {
                    scope.totalItems = 37;
                    scope.itemsPerPage = 10;
                    function checkPrevLink(page, expected) {
                        scope.page = page;
                        var element = $compile(directiveUsage)(scope)[0];
                        scope.$digest();
                        var firstButton = element.querySelector('.pagination-bar .pagination li');
                        expect(firstButton.innerText.trim()).toBe(expected);
                    }
                    checkPrevLink(1, '');
                    checkPrevLink(2, '« Prev');
                    checkPrevLink(3, '« Prev');
                    checkPrevLink(4, '« Prev');
            });

            it('should display next link except on the last one', function() {
                    scope.totalItems = 37;
                    scope.itemsPerPage = 10;
                    function checkPrevLink(page, expected) {
                        scope.page = page;
                        var element = $compile(directiveUsage)(scope)[0];
                        scope.$digest();
                        var lastButton = element.querySelectorAll('.pagination-bar .pagination li')[5];
                        expect(lastButton.innerText.trim()).toBe(expected);
                    }
                    checkPrevLink(1, 'Next »');
                    checkPrevLink(2, 'Next »');
                    checkPrevLink(3, 'Next »');
                    checkPrevLink(4, '');
            });

            it('should not display pagination links if all items can be displayed on current page', function() {
                    scope.totalItems = 10;
                    scope.itemsPerPage = 11;
                    scope.page = 1;
                    var element = $compile(directiveUsage)(scope)[0];
                    scope.$digest();
                    var buttons = element.querySelectorAll('.pagination-bar .pagination li');
                    expect(buttons.length).toBe(0);
            });

            it('should display all links if number of pages is below 5', function() {
                    scope.totalItems = 37;
                    scope.itemsPerPage = 10;
                    scope.page = 1;
                    function checkPrevLink(rank, expected) {
                        var element = $compile(directiveUsage)(scope)[0];
                        scope.$digest();
                        var lastButton = element.querySelectorAll('.pagination-bar .pagination li')[rank];
                        expect(lastButton.innerText.trim()).toBe(expected);
                    }
                    checkPrevLink(1, '1');
                    checkPrevLink(2, '2');
                    checkPrevLink(3, '3');
                    checkPrevLink(4, '4');
            });

            it('should display truncated centered page range if number of pages is above 5', function() {
                    scope.totalItems = 77;
                    scope.itemsPerPage = 10;
                    function checkPageLinks(page, expected) {
                        scope.page = page;
                        var element = $compile(directiveUsage)(scope)[0];
                        scope.$digest();
                        var buttons = Array.prototype.slice.call(element.querySelectorAll('.pagination-bar .pagination li'));
                        var buttonsText = buttons.map(function(button) { return button.innerText.trim(); });
                        expect(buttonsText).toEqual(expected);
                    }
                    checkPageLinks(1, ['', '1', '2', '3', '…', '8', 'Next »']);
                    checkPageLinks(2, ['« Prev', '1', '2', '3', '4', '…', '8', 'Next »']);
                    checkPageLinks(3, ['« Prev', '1', '2', '3', '4', '5', '…', '8', 'Next »']);
                    checkPageLinks(4, ['« Prev', '1', '2', '3', '4', '5', '6', '…', '8', 'Next »']);
                    checkPageLinks(5, ['« Prev', '1', '…', '3', '4', '5', '6', '7', '8', 'Next »']);
                    checkPageLinks(6, ['« Prev', '1', '…', '4', '5', '6', '7', '8', 'Next »']);
                    checkPageLinks(7, ['« Prev', '1', '…', '5', '6', '7', '8', 'Next »']);
                    checkPageLinks(8, ['« Prev', '1', '…', '6', '7', '8', '']);
            });
        });

        describe('with infinite pagination', function() {
            beforeEach(function() {
                scope.infinite = true;
            });

            it('should not be displayed if pagination is infinite', function() {
                var element = $compile(directiveUsage)(scope)[0];
                scope.$digest();
                expect(element.children.length).toBe(0);
            });
        });
    });
});
