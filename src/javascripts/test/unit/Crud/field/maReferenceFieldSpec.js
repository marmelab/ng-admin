describe('ReferenceField', function() {
    var directive = require('../../../../ng-admin/Crud/field/maReferenceField');
    var ReferenceField = require('admin-config/lib/Field/ReferenceField');

    var $compile, $timeout, scope;
    const directiveUsage = '<ma-reference-field entry="entry" field="field" value="value"></ma-reference-field>';

    angular.module('myTestingApp', ['ui.select']).directive('maReferenceField', directive);

    beforeEach(function() {
        angular.mock.module(function($provide) {
            $provide.service('ReadQueries', function($q) {
                this.getAllReferencedData = jasmine.createSpy('getAllReferencedData').and.callFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve({
                        'post_id': [
                            { id: 1, name: 'foo', count: 82 },
                            { id: 2, name: 'bar', count: 43 },
                            { id: 3, name: 'qux', count: 71 }
                        ]
                    });

                    return deferred.promise;
                });

                this.getOne = jasmine.createSpy('getOne').and.callFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve({ name: 'bar' });

                    return deferred.promise;
                });
            });
        });
    });

    beforeEach(angular.mock.module('myTestingApp'));

    var MockedReadQueries;
    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_, ReadQueries) {
        $compile = _$compile_;
        $timeout = _$timeout_;
        scope = _$rootScope_;
        MockedReadQueries = ReadQueries;
    }));

    beforeEach(function() {
        scope.field = new ReferenceField('post_id')
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
        scope.$digest();

        var uiSelect = element[0].querySelector('.ui-select-container');
        expect(uiSelect).toBeTruthy();
    });

    it('should call remote API when inputting first characters', function () {
        var element = $compile(directiveUsage)(scope);
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

    it('should return value transformed by `maps` field functions', function() {
        scope.field.map((e, r) => `${r.name} (${r.count})`);

        var element = $compile(directiveUsage)(scope);
        $timeout.flush();
        scope.$digest();

        var uiSelect = angular.element(element[0].querySelector('.ui-select-container')).controller('uiSelect');
        expect(angular.toJson(uiSelect.items)).toBe(angular.toJson([
            { value: 1, label: 'foo (82)' },
            { value: 2, label: 'bar (43)' },
            { value: 3, label: 'qux (71)' }
        ]));
    });

    it('should be pre-filled with related label at initialization', function () {
        scope.value = 2;

        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        $timeout.flush();

        var uiSelect = angular.element(element[0].querySelector('.ui-select-match-text'));
        expect(MockedReadQueries.getOne).toHaveBeenCalled();
        expect(uiSelect.text()).toBe('bar');
    });

    it('should get all choices loaded at initialization if refreshDelay is null', function() {
        scope.field.refreshDelay(null);

        var element = $compile(directiveUsage)(scope);
        $timeout.flush();
        scope.$digest();

        var uiSelect = angular.element(element[0].querySelector('.ui-select-container')).controller('uiSelect');
        expect(uiSelect.items.length).toBe(3);
    });
});
