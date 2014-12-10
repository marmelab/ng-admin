/*global define,angular,inject,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    describe('directive: number-field', function() {
        var directive = require('ng-admin/Crud/field/maNumberField');
        var Field = require('ng-admin/Main/component/service/config/Field');
        angular.module('testapp_NumberField', []).directive('maNumberField', directive);
        require('angular-mocks');

        var $compile,
            scope,
            directiveUsage = '<ma-number-field field="field" value="value"></ma-number-field>';

        beforeEach(module('testapp_NumberField'));

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            scope = _$rootScope_;
        }));

        it("should contain an input tag of type number", function() {
            scope.field = new Field();
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            var input = element.children()[0];
            expect(input.nodeName).toBe('INPUT');
            expect(input.type).toBe('number');
            expect(input.max).toEqual('');
            expect(input.min).toEqual('');
        });

        it("should add any supplied attribute", function() {
            scope.field = new Field().attributes({ step: 2 });
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.children()[0].step).toEqual('2');
        });

        it("should use the field min and max validation", function() {
            scope.field = new Field().validation({ min: -2, max: 2 });
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            var input = element.children()[0];
            expect(input.min).toEqual('-2');
            expect(input.max).toEqual('2');
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
            scope.value= 12;
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.find('input').val()).toEqual('12');
            scope.value= 43;
            scope.$digest();
            expect(element.find('input').val()).toEqual('43');
        });

    });
});
