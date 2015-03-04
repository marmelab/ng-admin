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
            directiveUsage = '<ma-choice-field field="field" value="value"></ma-choice-field>';

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
            // strange: angular.js adds an initial option of value '? value ?' for IE compatibility
            // so our initial option is of index 1, not 0
            expect(options[1].innerHTML).toEqual('-- select a value --');
            expect(options[1].value).toEqual('');
            expect(options[1].selected).toBeTruthy();
        });

        it("should provide an initial option for non-required fields", function () {
            scope.field = new ChoiceField().choices([
                {label: 'foo', value: 'bar'}
            ]).validation({ required: true });
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            var options = element.find('option');
            // strange: angular.js adds an initial option of value '? value ?' for IE compatibility
            // so our initial option is of index 1, not 0
            expect(options[1].innerHTML).toEqual('foo');
            expect(options[1].value).toEqual('bar');
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
            expect(options[1].innerHTML).toEqual('foo');
            expect(options[1].value).toEqual('bar');
            expect(options[2].innerHTML).toEqual('baz');
            expect(options[2].value).toEqual('bazValue');
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
            expect(options[2].value).toEqual('bazValue');
        });

    });
});
