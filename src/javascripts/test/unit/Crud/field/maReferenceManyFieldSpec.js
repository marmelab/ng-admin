describe('ReferenceField', function() {
    var directive = require('../../../../ng-admin/Crud/field/maReferenceManyField');
    var ReferenceManyField = require('admin-config/lib/Field/ReferenceManyField');

    var $compile, $timeout, scope;
    const directiveUsage = '<ma-reference-many-field entry="entry" field="field" value="value"></ma-reference-many-field>';

    beforeEach(function() {
        angular.mock.module(function($provide) {
            $provide.service('ReadQueries', function($q) {
                this.getOptimizedReferencedData = jasmine.createSpy('getOptimizedReferencedData').and.callFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve({
                        'tags': [
                            { id: 2, name: 'bar' },
                            { id: 3, name: 'qux' }
                        ]
                    });

                    return deferred.promise;
                });

                this.getAllReferencedData = jasmine.createSpy('getAllReferencedData').and.callFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve({
                        'tags': [
                            { id: 1, name: 'foo' },
                            { id: 2, name: 'bar' },
                            { id: 3, name: 'qux' }
                        ]
                    });

                    return deferred.promise;
                });
            });
        });
    });

    angular.module('myApp', ['ui.select']).directive('maReferenceManyField', directive);

    beforeEach(angular.mock.module('myApp'));

    var MockedReadQueries;
    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_, ReadQueries) {
        $compile = _$compile_;
        $timeout = _$timeout_;
        scope = _$rootScope_;
        MockedReadQueries = ReadQueries;
    }));

    beforeEach(function() {
        scope.field = new ReferenceManyField('tags')
            .targetField({
                name: () => 'name'
            })
            .targetEntity({
                identifier: () => {
                    return {
                        name: () => 'id'
                    };
                }
            });
    });

    it('should be an ui-select field', function() {
        var element = $compile(directiveUsage)(scope);
        $timeout.flush();
        scope.$digest();

        var uiSelect = element[0].querySelector('.ui-select-container');
        expect(uiSelect).toBeTruthy();
    });

    it('should call remote API when inputting first characters', function () {
        var element = $compile(directiveUsage)(scope);
        $timeout.flush();
        scope.$digest();

        var uiSelect = angular.element(element[0].querySelector('.ui-select-container')).controller('uiSelect');
        var choices = angular.element(element[0].querySelector('.ui-select-choices'));

        uiSelect.refreshItems(choices.attr('refresh'));
        $timeout.flush();

        expect(MockedReadQueries.getAllReferencedData).toHaveBeenCalled();
        expect(angular.toJson(uiSelect.items)).toEqual(angular.toJson([
            { value: 1, label: 'foo' },
            { value: 2, label: 'bar' },
            { value: 3, label: 'qux' }
        ]));
    });

    it('should be pre-filled with related labels at initialization', function () {
        scope.value = [2, 3];

        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        $timeout.flush();

        var tags = element[0].querySelectorAll('.ui-select-match-item .ng-scope');
        expect(MockedReadQueries.getOptimizedReferencedData).toHaveBeenCalled();
        expect(tags[0].innerText).toBe('bar');
        expect(tags[1].innerText).toBe('qux');
    });
});
