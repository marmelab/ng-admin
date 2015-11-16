/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: ma-column', function () {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/column/maColumn');
    var Field = require('admin-config/lib/Field/Field');
    angular.module('testapp_Column', [])
        .directive('maColumn', directive)
        .service('FieldViewConfiguration', () => ({ string: { getReadWidget: () => 'DUMMY' } }))
        .service('$state', () => ({}))
        .service('$anchorScroll', () => ({}))
        .service('NgAdminConfiguration', () => ({}));

    var $compile,
        scope,
        directiveUsage = '<ma-column field="::field" entry="entry" entity="::entity" datastore="::dataStore"></ma-column>';

    beforeEach(angular.mock.module('testapp_Column'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it("should render the ReadWidget from the fieldView Configuration for that type", function () {
        scope.field = new Field('foo');
        scope.entry = { values: { foo: null } };
        scope.entity = { isReadOnly: false, editionView: () => ({ enabled: true })};
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.html()).toContain('DUMMY');
    });

    it("should render the Field template instead of the ReadWidget when set", function () {
        scope.field = new Field('foo').template('YOPLA');
        scope.entry = { values: { foo: null } };
        scope.entity = { isReadOnly: false, editionView: () => ({ enabled: true })};
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.html()).not.toContain('DUMMY');
        expect(element.html()).toContain('YOPLA');
    });

});
