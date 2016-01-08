/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: date-field', function() {
    'use strict';

    var dateDirective = require('../../../../ng-admin/Crud/field/maDateField');
    var datepickerPopupDirective = require('../../../../ng-admin/Crud/field/datepickerPopup');
    var DateField = require('admin-config/lib/Field/DateField');

    angular.module('testapp_DateField', ['ui.bootstrap', 'ui.bootstrap.tpls'])
        .directive('maDateField', dateDirective)
        .directive('datepickerPopup', datepickerPopupDirective);

    var $compile,
        scope,
        directiveUsage = '<ma-date-field field="field" value="value"></ma-date-field>';

    beforeEach(angular.mock.module('testapp_DateField'));

    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it("should contain an input tag", function () {
        scope.field = new DateField();
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.find('input').eq(0).attr('type')).toBe('text');
    });

    it('should format default value correctly', function () {
        scope.value = new Date(2014, 2, 1);
        scope.field = (new DateField()).format('yyyy-MM-dd');

        var element = $compile(directiveUsage)(scope);
        scope.$digest();

        expect(element.find('input').eq(0).val()).toBe('2014-03-01');
    });

    it("should use the supplied format as datepicker parameter", function () {
        scope.field = new DateField().format('yyyy-MM');
        var date = new Date('2015-01-23');
        scope.value = date;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.find('input').eq(0).attr('uib-datepicker-popup')).toBe('yyyy-MM');
    });

    it("should add any supplied attribute", function () {
        scope.field = new DateField().attributes({ placeholder: 'here the date' });
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.find('input').eq(0).attr('placeholder')).toEqual('here the date');
    });

    it("should contain the bounded value", function () {
        scope.field = new DateField();
        var now = '2015-03-05';
        scope.value = now;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.find('input').eq(0).val()).toBe(now);
    });
});
