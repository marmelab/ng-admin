/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: date-field', function() {
    'use strict';

    var dateDirective = require('../../../../ng-admin/Crud/field/maDateField');
    var DateField = require('admin-config/lib/Field/DateField');

    angular.module('testapp_DateField', ['ui.bootstrap', 'ui.bootstrap.tpls'])
        .filter('translate', () => text => text)
        .directive('maDateField', dateDirective);

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
        var now = '2015-04-05';
        scope.value = new Date(now);
        scope.field = new DateField();
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.find('input').eq(0).val()).toBe(now);
    });

    it('should update rawValue when updating value directly', () => {
        const now = new Date('2016-09-18');
        scope.value = now;
        scope.field = new DateField();

        const element = $compile(directiveUsage)(scope);
        scope.$digest();

        scope.value = new Date('2010-01-01');
        scope.$digest();

        expect(element.find('input').eq(0).val()).toBe('2010-01-01');
    });

    it('should update value when updating the rawValue directly', () => {
        const now = new Date('2016-09-18');
        scope.value = now;
        scope.field = new DateField();

        const element = $compile(directiveUsage)(scope);
        const isolatedScope = element.isolateScope();

        isolatedScope.rawValue = new Date('2010-01-01');
        isolatedScope.$digest();

        expect(isolatedScope.value).toBe('2010-01-01');
    });
});
