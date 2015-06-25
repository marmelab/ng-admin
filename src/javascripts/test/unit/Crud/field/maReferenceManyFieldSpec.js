describe('ReferenceManyField', function() {
    var referenceManyFieldDirective = require('../../../../ng-admin/Crud/field/maReferenceManyField');
    var choicesFieldDirective = require('../../../../ng-admin/Crud/field/maChoicesField');
    var ReferenceManyField = require('admin-config/lib/Field/ReferenceManyField');
    var mixins = require('../../../mock/mixins');
    var DataStore = require('admin-config/lib/DataStore/DataStore');

    var $compile, $timeout, scope;
    const directiveUsage = '<ma-reference-many-field entry="entry" field="field" value="value" datastore="datastore"></ma-reference-many-field>';

    beforeEach(function() {
        angular.mock.module(function($provide) {
            $provide.service('ReferenceRefresher', function($q) {
                this.getInitialChoices = jasmine.createSpy('getInitialChoices').and.callFake(function() {
                    return mixins.buildPromise([
                        { value: 2, label: 'bar' },
                        { value: 3, label: 'qux' }
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

    angular.module('myApp', ['ui.select'])
        .directive('maChoicesField', choicesFieldDirective)
        .directive('maReferenceManyField', referenceManyFieldDirective);

    beforeEach(angular.mock.module('myApp'));

    var MockedReferenceRefresher;
    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_, ReferenceRefresher) {
        $compile = _$compile_;
        $timeout = _$timeout_;
        scope = _$rootScope_;
        MockedReferenceRefresher = ReferenceRefresher;
    }));

    beforeEach(function() {
        scope.datastore = new DataStore();
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

        uiSelect.refresh(choices.attr('refresh'));
        $timeout.flush();

        expect(MockedReferenceRefresher.refresh).toHaveBeenCalled();
        expect(angular.toJson(uiSelect.items)).toEqual(angular.toJson([
            { value: 1, label: 'foo' },
            { value: 2, label: 'bar' },
            { value: 3, label: 'qux' }
        ]));
    });

    it('should get all choices loaded at initialization if refreshDelay is null', function() {
        scope.field.autocompleteOptions({ refreshDelay: null });

        var element = $compile(directiveUsage)(scope);
        $timeout.flush();
        scope.$digest();

        var uiSelect = angular.element(element[0].querySelector('.ui-select-container')).controller('uiSelect');
        expect(angular.toJson(uiSelect.items)).toEqual(JSON.stringify([
            { value: 1, label: 'foo' },
            { value: 2, label: 'bar' },
            { value: 3, label: 'qux' }
        ]));
    });
});
