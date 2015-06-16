describe('ReferenceField', function() {
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

    it('should be an ui-select field', function() {
        scope.field = new ReferenceField();
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        var uiSelect = element[0].querySelector('.ui-select-container');
        expect(uiSelect).toBeTruthy();
    });

    fit('should call remote API when inputting first characters', function () {
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
        expect(false).toBe(true);
    });

    it('should update field value when clicking on autocomplete result', function() {
        expect(false).toBe(true);
    })
});
