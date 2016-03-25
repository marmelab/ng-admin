/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: choice-field', function () {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/field/maChoiceField');
    var ChoiceField = require('admin-config/lib/Field/ChoiceField');

    angular.module('testapp_ChoiceField', ['ui.select'])
        .filter('translate', () => text => text)
        .directive('maChoiceField', directive);

    var $compile,
        scope,
        directiveUsage = '<ma-choice-field entry="entry" field="field" value="value"></ma-choice-field>';

    beforeEach(angular.mock.module('testapp_ChoiceField'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it("should contain a ui-select tag", function () {
        scope.field = new ChoiceField();
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        var uiSelect = element.children()[0];
        expect(uiSelect.classList.contains('ui-select-container')).toBeTruthy();
    });

    it("should add any supplied attribute", function () {
        scope.field = new ChoiceField().attributes({ disabled: true });
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].getAttribute('disabled')).toBeTruthy();
    });

    it('should allow to remove selected option only if not required', function() {
        function test(isRequired, expectedAllowClearValue) {
            scope.field = new ChoiceField().validation({ required: isRequired });
            var element = $compile(directiveUsage)(scope);
            scope.$digest();

            expect(element[0].querySelector('.ui-select-match').getAttribute('allow-clear')).toEqual(expectedAllowClearValue.toString());
        }

        test(true, false);
        test(false, true);
    });

    it("should contain the choices as options", function () {
        scope.field = new ChoiceField().choices([
            {label: 'foo', value: 'bar'},
            {label: 'baz', value: 'bazValue'}
        ]);

        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        var uiSelect = angular.element(element.children()[0]).controller('uiSelect');
        expect(angular.toJson(uiSelect.items)).toEqual(JSON.stringify([
            {label: 'foo', value: 'bar'},
            {label: 'baz', value: 'bazValue'}
        ]));
    });

    it("should contain the choices from choicesFunc as options", function () {
        var choices = [
            {label: 'foo', value: 'bar'},
            {label: 'baz', value: 'bazValue'}
        ];

        scope.field = new ChoiceField().choices(function(entry){
            return choices;
        });

        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        var uiSelect = angular.element(element.children()[0]).controller('uiSelect');
        expect(angular.toJson(uiSelect.items)).toEqual(JSON.stringify([
            {label: 'foo', value: 'bar'},
            {label: 'baz', value: 'bazValue'}
        ]));
    });

    it("should pass entry to choicesFunc", function () {
        var choices = [];
        var choicesFuncWasCalled = false;

        scope.entry = {moo: 'boo'};
        scope.field = new ChoiceField().choices(function(entry){
            expect(entry.moo).toEqual('boo');
            choicesFuncWasCalled = true;
            return choices;
        });

        $compile(directiveUsage)(scope);
        scope.$digest();

        expect(choicesFuncWasCalled).toBeTruthy();
    });

    it("should have the option with the bounded value selected", function () {
        scope.field = new ChoiceField().choices([
            {label: 'foo', value: 'bar'},
            {label: 'baz', value: 'bazValue'}
        ]);

        scope.value = 'bazValue';

        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        var uiSelect = angular.element(element.children()[0]).controller('uiSelect');
        expect(angular.toJson(uiSelect.selected)).toEqual(JSON.stringify({
            label: 'baz',
            value: 'bazValue'
        }));
    });
});
