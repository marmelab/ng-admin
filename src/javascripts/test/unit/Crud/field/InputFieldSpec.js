/*global define,angular,inject,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    describe('directive: input-field', function() {
        var directive = require('ng-admin/Crud/field/InputField');
        var Field = require('ng-admin/Main/component/service/config/Field');
        angular.module('testapp_InputField', []).directive('inputField', directive);
        require('angular-mocks');

        var $compile,
            scope,
            directiveUsage = '<input-field type="{{ type }}" field="field" value="value"></input-field>';

        beforeEach(module('testapp_InputField'));

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            scope = _$rootScope_;
        }));

        it("should contain an input tag", function() {
            scope.field = new Field();
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.children()[0].nodeName).toBe('INPUT');
            expect(element.children()[0].type).toBe('text');
        });

        it("should use the passed type", function() {
            scope.field = new Field();
            scope.type = "checkbox";
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.children()[0].type).toBe('checkbox');
        });

        it("should contain the field classes", function() {
            scope.field = new Field().cssClasses(['foo', 'bar']);
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            var classList = element.children()[0].classList;
            expect(classList.contains('foo')).toBeTruthy();
            expect(classList.contains('bar')).toBeTruthy();
        });

        it("should contain the bounded value", function() {
            scope.field = new Field();
            scope.value= "foobar";
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.find('input').val()).toBe('foobar');
            scope.value= "baz";
            scope.$digest();
            expect(element.find('input').val()).toBe('baz');
        });

    });
});
