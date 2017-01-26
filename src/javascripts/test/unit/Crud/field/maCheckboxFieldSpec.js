/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: checkbox-field', function () {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/field/maCheckboxField');
    var Field = require('admin-config/lib/Field/Field');
    angular.module('testapp_CheckboxField', []).directive('maCheckboxField', directive);

    var $compile,
        scope,
        directiveUsage = '<ma-checkbox-field field="field" value="value"></ma-checkbox-field>';

    beforeEach(angular.mock.module('testapp_CheckboxField'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it("should contain an input tag", function () {
        scope.field = new Field();
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].nodeName).toBe('INPUT');
    });

    it("should use the checkbox type", function () {
        scope.field = new Field();
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].type).toBe('checkbox');
    });

    it("should be checked according to the bounded value", function () {
        scope.field = new Field();
        scope.value = true;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element[0].querySelector(':checked')).toBeTruthy();
        scope.value = false;
        scope.$digest();
        expect(element[0].querySelector(':checked')).toBeFalsy();
    });
});
