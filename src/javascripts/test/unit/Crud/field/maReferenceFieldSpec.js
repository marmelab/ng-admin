fdescribe('ReferenceField', function() {
    var directive = require('../../../../ng-admin/Crud/field/maReferenceField');
    var ReferenceField = require('admin-config/lib/Field/ReferenceField');

    var $compile, $timeout, scope;
    const directiveUsage = '<ma-reference-field entry="entry" field="field" value="value"></ma-reference-field>';

    beforeEach(function() {
        angular.mock.module(function($provide) {
            $provide.service('ReadQueries', function($q) {
                this.getAllReferencedData = jasmine.createSpy('getAllReferencedData').and.callFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve({
                        'post_id': [
                            { id: 1, name: 'foo' },
                            { id: 2, name: 'bar' },
                            { id: 3, name: 'qux' }
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

    angular.module('myApp', ['ui.select']).directive('maReferenceField', directive);

    beforeEach(angular.mock.module('myApp'));

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

    it('should be pre-filled with related label at initialization', function () {
        scope.value = 2;

        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        $timeout.flush();

        var uiSelect = angular.element(element[0].querySelector('.ui-select-match-text'));
        expect(MockedReadQueries.getOne).toHaveBeenCalled();
        expect(uiSelect.text()).toBe('bar');
    });
});
