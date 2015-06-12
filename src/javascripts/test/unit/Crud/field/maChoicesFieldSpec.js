/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: choices-field', function() {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/field/maChoicesField');
    var ChoicesField = require('admin-config/lib/Field/ChoicesField');
    var DataStore = require('admin-config/lib/DataStore/DataStore');

    var dataStoreModule = angular.module('testapp_DataStore', []);
    dataStoreModule.constant('DataStore', new DataStore());

    angular.module('testapp_ChoicesField', ['ui.select', 'testapp_DataStore']).directive('maChoicesField', directive);

    var $compile,
        scope,
        directiveUsage = '<ma-choices-field entry="entry" field="field" value="value"></ma-choices-field>';

    beforeEach(angular.mock.module('testapp_ChoicesField'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it("should contain a select multiple tag", function () {
        scope.field = new ChoicesField();
        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        var uiSelect = element.children()[0];
        expect(uiSelect.classList.contains('ui-select-container')).toBeTruthy();
    });

    it("should add any supplied attribute", function () {
        scope.field = new ChoicesField().attributes({ disabled: true });
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].getAttribute('disabled')).toBeTruthy();
    });

    it("should pass entry to choicesFunc", function () {
        var choices = [];
        var choicesFuncWasCalled = false;

        scope.entry = {moo: 'boo'};
        scope.field = new ChoicesField().choices(function(entry){
            expect(entry.moo).toEqual('boo');
            choicesFuncWasCalled = true;
            return choices;
        });

        $compile(directiveUsage)(scope);
        scope.$digest();

        expect(choicesFuncWasCalled).toBeTruthy();
    });

    it("should contain the choices from choicesFunc as options", function () {
        var choices = [
            {label: 'foo', value: 'bar'},
            {label: 'baz', value: 'bazValue'}
        ];

        scope.field = new ChoicesField().choices(function(entry){
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

    it("should contain the choices as options", function () {
        scope.field = new ChoicesField().choices([
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

    it("should have the option with the bounded value selected", function () {
        scope.field = new ChoicesField().choices([
            {label: 'foo', value: 'fooValue'},
            {label: 'bar', value: 'barValue'},
            {label: 'baz', value: 'bazValue'}
        ]);

        scope.value = ['fooValue', 'bazValue'];

        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        var uiSelect = angular.element(element.children()[0]).controller('uiSelect');
        expect(angular.toJson(uiSelect.selected)).toEqual(JSON.stringify([
            { label: 'foo', value: 'fooValue' },
            { label: 'baz', value: 'bazValue' }
        ]));
    });
});
