require('angular-translate');

/*global angular,inject,describe,it,expect,beforeEach,module*/
describe('directive: ma-datagrid-pagination', function () {
    var directive = require('../../../../ng-admin/Crud/list/maDatagridPagination'),
        $compile,
        scope,
        directiveUsage = '<ma-datagrid-pagination page="{{ page }}" total-items="{{ totalItems }}" per-page="{{ itemsPerPage }}"></ma-datagrid-pagination>';

    angular.module('testapp_DatagridPagination', ['pascalprecht.translate'])
        .directive('maDatagridPagination', directive)
        .config(['$translateProvider', function($translateProvider) {
            $translateProvider.translations('en', {
              'PAGINATION': '<strong>{{ begin }}</strong> - <strong>{{ end }}</strong> of <strong>{{ total }}</strong>',
            });
            $translateProvider.preferredLanguage('en');
        }]);

    beforeEach(angular.mock.module('testapp_DatagridPagination'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    describe('total display', function() {
        it('should just display that no records have been found if no item fetched', function() {
            scope.totalItems = 0;
            var element = $compile(directiveUsage)(scope)[0];
            scope.$digest();

            var totalElement = element.querySelector('.pagination-bar .total');
            expect(totalElement.innerText.trim()).toBe('NO_PAGINATION');
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

            checkTotalText(-1, '1 - 10 of 37');     // Lower pages should be considered as page 1
            checkTotalText( 0, '1 - 10 of 37');
            checkTotalText( 1, '1 - 10 of 37');
            checkTotalText( 2, '11 - 20 of 37');
            checkTotalText( 3, '21 - 30 of 37');
            checkTotalText( 4, '31 - 37 of 37');
            checkTotalText( 8, '31 - 37 of 37');    // Higher pages should be considered as last page
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
            checkPrevLink(2, 'PREVIOUS');
            checkPrevLink(3, 'PREVIOUS');
            checkPrevLink(4, 'PREVIOUS');
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
            checkPrevLink(1, 'NEXT');
            checkPrevLink(2, 'NEXT');
            checkPrevLink(3, 'NEXT');
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
            var element = $compile(directiveUsage)(scope)[0];
            scope.$digest();
            var buttons = element.querySelectorAll('.pagination-bar .pagination li');
            expect(buttons[1].innerText.trim()).toBe('1');
            expect(buttons[2].innerText.trim()).toBe('2');
            expect(buttons[3].innerText.trim()).toBe('3');
            expect(buttons[4].innerText.trim()).toBe('4');
    });

    it('should display truncated centered page range if number of pages is above 5', function() {
            scope.totalItems = 87;
            scope.itemsPerPage = 10;
            function checkPageLinks(page, expected) {
                scope.page = page;
                var element = $compile(directiveUsage)(scope)[0];
                scope.$digest();
                var buttons = Array.prototype.slice.call(element.querySelectorAll('.pagination-bar .pagination li'));
                var buttonsText = buttons.map(function(button) { return button.innerText.trim(); });
                expect(buttonsText).toEqual(expected);
            }
            checkPageLinks(1, ['', '1', '2', '…', '9', 'NEXT']);
            checkPageLinks(2, ['PREVIOUS', '1', '2', '3', '…', '9', 'NEXT']);
            checkPageLinks(3, ['PREVIOUS', '1', '2', '3', '4', '…', '9', 'NEXT']);
            checkPageLinks(4, ['PREVIOUS', '1', '2', '3', '4', '5', '…', '9', 'NEXT']);
            checkPageLinks(5, ['PREVIOUS', '1', '…', '4', '5', '6', '…', '9', 'NEXT']);
            checkPageLinks(6, ['PREVIOUS', '1', '…', '5', '6', '7', '8', '9', 'NEXT']);
            checkPageLinks(7, ['PREVIOUS', '1', '…', '6', '7', '8', '9', 'NEXT']);
            checkPageLinks(8, ['PREVIOUS', '1', '…', '7', '8', '9', 'NEXT']);
            checkPageLinks(9, ['PREVIOUS', '1', '…', '8', '9', '']);
    });
});
