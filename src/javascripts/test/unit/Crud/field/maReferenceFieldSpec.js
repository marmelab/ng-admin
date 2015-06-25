describe('ReferenceField', function() {
    var choiceDirective = require('../../../../ng-admin/Crud/field/maChoiceField');
    var referenceDirective = require('../../../../ng-admin/Crud/field/maReferenceField');
    var ReferenceField = require('admin-config/lib/Field/ReferenceField');
    var mixins = require('../../../mock/mixins');
    var DataStore = require('admin-config/lib/DataStore/DataStore');

    var $compile, $timeout, scope;
    const directiveUsage = `
        <ma-reference-field
            entry="entry"
            field="field"
            value="value"
            datastore="datastore">
        </ma-reference-field>`;

    angular.module('myTestingApp', ['ui.select', 'testapp_DataStore'])
        .directive('maChoiceField', choiceDirective)
        .directive('maReferenceField', referenceDirective);

    beforeEach(function() {
        angular.mock.module(function($provide) {
            $provide.service('ReferenceRefresher', function($q) {
                this.getInitialChoices = jasmine.createSpy('getInitialChoices').and.callFake(function() {
                    return mixins.buildPromise([
                        { value: 2, label: 'bar' }
                    ]);
                });

                this.refresh = jasmine.createSpy('refresh').and.callFake(function() {
                    return mixins.buildPromise([
                        { value: 1, label: 'foo' },
                        { value: 2, label: 'bar' },
                        { value: 3, label: 'qux' }
                    ]);
                });
            });
        });
    });

    beforeEach(angular.mock.module('myTestingApp'));

    var MockedReferenceRefresher;
    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_, ReferenceRefresher) {
        $compile = _$compile_;
        $timeout = _$timeout_;
        scope = _$rootScope_;
        MockedReferenceRefresher = ReferenceRefresher;
    }));

    beforeEach(function() {
        scope.datastore = new DataStore();
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
            })
            .refreshDelay(500);
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

        uiSelect.refresh(element.attr('refresh'));
        $timeout.flush();
        scope.$digest();

        expect(MockedReferenceRefresher.refresh).toHaveBeenCalled();
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
        expect(uiSelect.text()).toBe('bar');
    });

    it('should get all choices loaded at initialization if refreshDelay is null', function() {
        scope.value = 2;
        scope.field.refreshDelay(null);

        var element = $compile(directiveUsage)(scope);
        $timeout.flush();
        scope.$digest();

        var uiSelect = angular.element(element[0].querySelector('.ui-select-container')).controller('uiSelect');
        expect(uiSelect.items).toEqual([
            { value: 2, label: 'bar' }
        ]);
    });
});
