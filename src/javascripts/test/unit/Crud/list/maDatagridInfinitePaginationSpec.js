import lodash from 'lodash';

/*global angular,inject,describe,it,jasmine,expect,beforeEach,module*/
const directive = require('../../../../ng-admin/Crud/list/maDatagridInfinitePagination');

describe('directive: ma-datagrid-infinite-pagination', function () {
    let $compile;
    let $scope;
    let $window;
    let $document;
    let element;
    let bodyHeightMock;
    let handler;
    let pageSize = 2000;
    let directiveUsage = `<ma-datagrid-infinite-pagination
        next-page="nextPage"
        total-items="{{ totalItems }}"
        per-page="{{ itemsPerPage }}"
    ></ma-datagrid-infinite-pagination>`;

    function waitForProcessing(scope, callback) {
        const interval = setInterval(() => {
            if (!scope.processing) {
                clearInterval(interval);
                callback(null, true);
            }
        }, 100);
    }

    function removeBodyHeightMock(){
        angular.element($document[0].querySelector('#mock')).remove();
    }

    function addBodyHeightMock(){
        bodyHeightMock = angular.element(`<div id="mock" style="height:${pageSize}px"></div>`)[0];
        angular.element($document[0].body).append(bodyHeightMock);
    }

    function initializeBodyHeightMock() {
        removeBodyHeightMock();
        addBodyHeightMock();
        simulateLoadOnBodyHeight(1);
    }

    function simulateLoadOnBodyHeight(page) {
        angular.element($document[0].querySelector('#mock')).css('height',(pageSize*page) + 'px');
    }

    function simulateScrollToPage(page, scope, callback) {
        const scrollSize = pageSize * (page - 1) + 1500;
        $window.scrollY = scrollSize;
        handler({ deltaY: scrollSize });
        callback();
    }

    function initializeScope(scope) {
        scope.nextPage = jasmine.createSpy('nextPage').and.callFake(() => (page) => {
            simulateLoadOnBodyHeight(page);
        });
        scope.totalItems = 100;
        scope.itemsPerPage = 10;
    }

    function initializeElement() {
        initializeScope($scope);
        element = $compile(directiveUsage)($scope);
        $scope.$digest();
    }

    angular.module('testapp_DatagridInfinitePagination', [])
        .directive('maDatagridInfinitePagination', directive);

    beforeEach(angular.mock.module('testapp_DatagridInfinitePagination'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _$window_, _$document_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $window = _$window_;
        $window.innerHeight = 759;
        spyOn($window, 'addEventListener').and.callFake((evt, callback) => {
            handler = callback;
        });
        spyOn(lodash, 'debounce').and.callFake(func => func);
        $document = _$document_;
        initializeBodyHeightMock();
        initializeElement();
    }));

    it('should trigger next-page when scrolling', function (done) {
        const isolatedScope = element.isolateScope();
        initializeScope(isolatedScope);

        waitForProcessing(isolatedScope, () => {
            simulateScrollToPage(2, isolatedScope, () => {
                waitForProcessing(isolatedScope, () => {
                    expect(isolatedScope.nextPage).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    it('should trigger next-page twice when scrolling twice', function(done) {
        const isolatedScope = element.isolateScope();
        initializeScope(isolatedScope);

        waitForProcessing(isolatedScope, () => {
            simulateScrollToPage(2, isolatedScope, () => {
                simulateScrollToPage(3, isolatedScope, () => {
                    expect(isolatedScope.nextPage.calls.count()).toEqual(2);
                    done();
                });
            });
        });
    });

    it('should trigger next-page with right page number', function(done) {
        const isolatedScope = element.isolateScope();
        initializeScope(isolatedScope);

        const argsForCall = [];

        isolatedScope.nextPage = jasmine.createSpy('nextPage').and.callFake(() => (page) => {
            simulateLoadOnBodyHeight(page);
            argsForCall.push(page);
        });

        waitForProcessing(isolatedScope, () => {
            simulateScrollToPage(2, isolatedScope, () => {
                simulateScrollToPage(3, isolatedScope, () => {
                    expect(argsForCall[0]).toEqual(2);
                    expect(argsForCall[1]).toEqual(3);
                    done();
                });
            });
        });
    });

    it('should not trigger next-page when scrolling up', function(done) {
        const isolatedScope = element.isolateScope();
        initializeScope(isolatedScope);

        waitForProcessing(isolatedScope, () => {
            simulateScrollToPage(2, isolatedScope, () => {
                simulateScrollToPage(3, isolatedScope, () => {
                    simulateScrollToPage(2, isolatedScope, () => {
                        expect(isolatedScope.nextPage.calls.count()).toEqual(3);
                        done();
                    });
                });
            });
        });
    });

    afterEach(function() {
        $scope.$destroy();
    });
});
