/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: input-field', function () {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/field/maInputField');
    var Field = require('admin-config/lib/Field/Field');
    angular.module('testapp_InputField', []).directive('maInputField', directive);

    var $compile,
        scope,
        directiveUsage = '<ma-input-field type="{{ type }}" field="field" value="value"></ma-input-field>';

    beforeEach(angular.mock.module('testapp_InputField'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it("should contain an input tag", function () {
        scope.field = new Field();
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].nodeName).toBe('INPUT');
        expect(element.children()[0].type).toBe('text');
    });

    it("should use the passed type", function () {
        scope.field = new Field();
        scope.type = "checkbox";
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].type).toBe('checkbox');
    });

    it("should add any supplied attribute", function () {
        scope.field = new Field().attributes({ autocomplete: 'off' });
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].getAttribute('autocomplete')).toEqual('off');
    });

    it("should use the field min and max attributes", function () {
        scope.field = new Field().attributes({ min: -2, max: 2 });
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        var input = element.children()[0];
        expect(input.getAttribute('min')).toEqual('-2');
        expect(input.getAttribute('max')).toEqual('2');
    });

    it("should contain the bounded value", function () {
        scope.field = new Field();
        scope.value = "foobar";
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.find('input').val()).toBe('foobar');
        scope.value = "baz";
        scope.$digest();
        expect(element.find('input').val()).toBe('baz');
    });

    it('should set `step` attribute in scope if passed as element attribute', function() {
        scope.field = new Field().attributes({ step: 'any' });
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.find('input')[0].step).toBe('any');
    });
});
