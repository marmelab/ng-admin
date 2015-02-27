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

                    var totalElement = element.querySelector('.grid-detail .total');
                    expect(totalElement.innerText.trim()).toBe('No record found.');
                });

                it('should display item range displayed', function() {
                    scope.totalItems = 37;
                    scope.itemsPerPage = 10;

                    function checkTotalText(page, expectedText) {
                        scope.page = page;
                        var element = $compile(directiveUsage)(scope)[0];
                        scope.$digest();

                        var totalElement = element.querySelector('.grid-detail .total');
                        expect(totalElement.innerText.trim()).toBe(expectedText);
                    }

                    checkTotalText(-1, '1 - 10 on 37');     // Lower pages should be considered as page 1
                    checkTotalText( 0, '1 - 10 on 37');
                    checkTotalText( 1, '1 - 10 on 37');
                    checkTotalText( 2, '11 - 20 on 37');
                    checkTotalText( 4, '31 - 37 on 37');
                    checkTotalText( 8, '31 - 37 on 37');    // Higher pages should be considered as last page
                });
            });

            it("should not display pagination links if all items can be displayed on current page", function () {
            });

            it("should display all links if number of pages is below page range", function() {
            });

            it("should display truncated centered page range if too many pages compared to given page range", function() {
            });
        });

        describe('with infinite pagination', function() {
            beforeEach(function() {
                scope.infinite = true;
            });

            it('should not be displayed if pagination is infinite', function() {
                var element = $compile(directiveUsage)(scope)[0];
                expect(element.children().length).toBe(0);
            });
        });
    });
});
