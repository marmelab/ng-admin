/*global define,angular,inject,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    describe('directive: choice-field', function () {
        var directive = require('ng-admin/Crud/field/maChoiceField');
        var ChoiceField = require('ng-admin/es6/lib/Field/ChoiceField');

        angular.module('testapp_ChoiceField', []).directive('maChoiceField', directive);
        require('angular-mocks');

        var $compile,
            scope,
            directiveUsage = '<ma-choice-field entry="entry" field="field" value="value"></ma-choice-field>';

        beforeEach(module('testapp_ChoiceField'));

        beforeEach(inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            scope = _$rootScope_;
        }));

        it("should contain a select tag", function () {
            scope.field = new ChoiceField();
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.children()[0].nodeName).toBe('SELECT');
        });

        it("should add any supplied attribute", function () {
            scope.field = new ChoiceField().attributes({ disabled: true });
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.children()[0].disabled).toBeTruthy();
        });

        it("should provide an initial option for non-required fields", function () {
            scope.field = new ChoiceField().choices([
                {label: 'foo', value: 'bar'}
            ]);
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            var options = element.find('option');
            expect(options[0].innerHTML).toEqual('-- select a value --');
            expect(options[0].value).toEqual('');
        });

        it("should provide an initial option for non-required fields", function () {
            scope.field = new ChoiceField().choices([
                {label: 'foo', value: 'bar'}
            ]).validation({ required: true });
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            var options = element.find('option');
            expect(options[1].label).toEqual('foo');
            expect(options[1].value).toEqual('0');
        });

        it("should contain the choices as options", function () {
            scope.field = new ChoiceField().choices([
                {label: 'foo', value: 'bar'},
                {label: 'baz', value: 'bazValue'}
            ]);
            scope.value = 'bar';
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            var options = element.find('option');
            expect(options[1].label).toEqual('foo');
            expect(options[1].value).toEqual('0');
            expect(options[2].label).toEqual('baz');
            expect(options[2].value).toEqual('1');
        });

        it("should contain the choices from choicesFunc as options", function () {
            var choices = [
                {label: 'foo', value: 'bar'},
                {label: 'baz', value: 'bazValue'}
            ];
            scope.field = new ChoiceField().choices(function(entry){
                return choices;
            });
            scope.value = 'bar';
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            var options = element.find('option');
            expect(options[1].label).toEqual('foo');
            expect(options[1].value).toEqual('0');
            expect(options[2].label).toEqual('baz');
            expect(options[2].value).toEqual('1');
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
            var element = $compile(directiveUsage)(scope);
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
            var options = element.find('option');
            expect(options[2].selected).toBeTruthy();
            expect(options[2].value).toEqual('1');
        });

    });
});
