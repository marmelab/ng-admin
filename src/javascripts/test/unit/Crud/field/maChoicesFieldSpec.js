/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: choices-field', function() {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/field/maChoicesField');
    var ChoiceField = require('admin-config/lib/Field/ChoiceField');
    var DataStore = require('admin-config/lib/DataStore/DataStore');

    var dataStoreModule = angular.module('testapp_DataStore', []);
    dataStoreModule.constant('DataStore', new DataStore());

    angular.module('testapp_ChoicesField', ['testapp_DataStore']).directive('maChoicesField', directive);

    var $compile,
        scope,
        directiveUsage = '<ma-choices-field entry="entry" field="field" value="value"></ma-choices-field>';

    beforeEach(angular.mock.module('testapp_ChoicesField'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it("should contain a select multiple tag", function () {
        scope.field = new ChoiceField();
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].nodeName).toBe('SELECT');
        expect(element.children()[0].multiple).toBeTruthy();
    });

    it("should add any supplied attribute", function () {
        scope.field = new ChoiceField().attributes({ disabled: true });
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].disabled).toBeTruthy();
    });

    it("should pass entry to choices func", function () {
        var choices = [];
        var choicesFuncWasCalled = false;
        scope.entry = {moo: 'boo'};
        scope.field = new ChoiceField().choices(function(entry) {
            expect(entry.moo).toEqual('boo');
            choicesFuncWasCalled = true;
            return choices;
        });
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(choicesFuncWasCalled).toBeTruthy();
    });

    it("should contain the choices from choicesFunc as options", function () {
        var choices = [
            {label: 'foo', value: 'bar'},
            {label: 'baz', value: 'bazValue'}
        ];
        scope.field = new ChoiceField().choices(function(entry) {
            return choices;
        });
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        var options = element.find('option');
        expect(options[0].label).toEqual('foo');
        expect(options[0].value).toEqual('string:bar');
        expect(options[1].label).toEqual('baz');
        expect(options[1].value).toEqual('string:bazValue');
    });

    it("should contain the choices as options", function () {
        scope.field = new ChoiceField().choices([
            {label: 'foo', value: 'bar'},
            {label: 'baz', value: 'bazValue'}
        ]);
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        var options = element.find('option');
        expect(options[0].label).toEqual('foo');
        expect(options[0].value).toEqual('string:bar');
        expect(options[1].label).toEqual('baz');
        expect(options[1].value).toEqual('string:bazValue');
    });

    it("should have the options with the bounded value selected", function () {
        scope.field = new ChoiceField().choices([
            {label: 'foo', value: 'fooValue'},
            {label: 'bar', value: 'barValue'},
            {label: 'baz', value: 'bazValue'}
        ]);
        scope.value = ['fooValue', 'bazValue'];
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        var options = element.find('option');
        expect(options[0].value).toEqual('string:fooValue');
        expect(options[0].selected).toBeTruthy();
        expect(options[1].value).toEqual('string:barValue');
        expect(options[1].selected).toBeFalsy();
        expect(options[2].value).toEqual('string:bazValue');
        expect(options[2].selected).toBeTruthy();
    });
});
