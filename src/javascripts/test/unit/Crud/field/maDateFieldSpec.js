/*global define,angular,inject,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    describe('directive: date-field', function() {
        var directive = require('ng-admin/Crud/field/maDateField');
        var Field = require('ng-admin/Main/component/service/config/Field');
        angular.module('testapp_DateField', []).directive('maDateField', directive);
        require('angular-mocks');

        var $compile,
            scope,
            directiveUsage = '<ma-date-field field="field" value="value"></ma-date-field>';

        beforeEach(module('testapp_DateField'));

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            scope = _$rootScope_;
        }));

        it("should contain an input tag", function () {
            scope.field = new Field();
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.find('input').eq(0).attr('type')).toBe('text');
        });

        it("should add any supplied attribute", function () {
            scope.field = new Field().attributes({ placeholder: 'here the date' });
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.find('input').eq(0).attr('placeholder')).toEqual('here the date');
        });

        it("should contain the bounded value", function () {
            scope.field = new Field();
            var now = new Date();
            scope.value = now;
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.find('input').eq(0).val()).toBe(now.toString());
        });

    });
});
