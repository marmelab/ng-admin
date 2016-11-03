/*global angular,inject,describe,it,jasmine,expect,beforeEach,module*/
describe('directive: ma-datagrid-infinite-pagination', function () {
    var directive = require('../../../../ng-admin/Crud/list/maDatagridInfinitePagination'),
        $compile,
        scope,
        $window,
        $document,
        element,
        bodyHeightMock,
        pageSize = 2000,
        directiveUsage = '<ma-datagrid-infinite-pagination next-page="nextPage" total-items="{{ totalItems }}" per-page="{{ itemsPerPage }}"></ma-datagrid-infinite-pagination>';

    function initializeBodyHeightMock(){
        if(!angular.element($document[0].querySelector('#mock')).length){
            bodyHeightMock = angular.element(`<div id="mock" style="height:${pageSize}px"></div>`)[0];
            angular.element($document[0].body).append(bodyHeightMock);
        }else{
            simulateLoadOnBodyHeight(1);
        }
    }

    function simulateLoadOnBodyHeight(page){
        angular.element($document[0].querySelector('#mock')).css('height',(pageSize*page) + 'px');
    }

    function simulateScrollToPage(page){
        $window.scrollY = pageSize * (page-1) + 1500;
        angular.element($window).triggerHandler('scroll');
    }

    function initializeScope(){
        scope.nextPage = jasmine.createSpy('nextPage').and.callFake(function(page) {
            simulateLoadOnBodyHeight(page);
        });
        scope.totalItems = 100;
        scope.itemsPerPage = 10;
    }

    function initializeElement(){
        element = $compile(directiveUsage)(scope);
        scope.$digest();
    }

    angular.module('testapp_DatagridInfinitePagination', [])
        .directive('maDatagridInfinitePagination', directive);

    beforeEach(angular.mock.module('testapp_DatagridInfinitePagination'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _$window_, _$document_) {
        $compile = _$compile_;
        scope = _$rootScope_.$new();
        $window = _$window_;
        $document = _$document_;
        initializeBodyHeightMock();
        initializeScope();
        initializeElement();
    }));

    it('should trigger next-page when scrolling', function () {
        simulateScrollToPage(2);
        expect(scope.nextPage).toHaveBeenCalled();
    });

    it('should trigger next-page twice when scrolling twice', function(){
        simulateScrollToPage(2);
        simulateScrollToPage(3);
        expect(scope.nextPage.calls.count()).toEqual(2);
    });

    it('should trigger next-page with right page number', function(){
        simulateScrollToPage(2);
        simulateScrollToPage(3);
        expect(scope.nextPage.calls.argsFor(0)).toEqual([2]);
        expect(scope.nextPage.calls.argsFor(1)).toEqual([3]);
    });

    it('should not trigger next-page if not scrolling', function () {
        expect(scope.nextPage).not.toHaveBeenCalled();
    });

    it('should not trigger next-page when scrolling up', function(){
        simulateScrollToPage(2);
        simulateScrollToPage(3);
        simulateScrollToPage(2);
        expect(scope.nextPage.calls.count()).toEqual(2);
    });

    afterEach(function(){
        scope.$destroy();
    });
});
