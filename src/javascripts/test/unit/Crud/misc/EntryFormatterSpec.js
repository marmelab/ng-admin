/*global jasmine,angular,describe,it,expect,beforeEach,spyOn*/
var EntryFormatter = require('../../../../ng-admin/Crud/misc/EntryFormatter');
var $filter = function (filter) {
    return function (value, format) {
        return {
            filter: filter,
            value: value,
            format: format
        };
    };
};

function getField(literal) {
    var field = {};
    Object.keys(literal).forEach(function (attr) {
        field[attr] = function () {
            return literal[attr];
        };
    });
    return field;
}

describe("Service: EntryFormatter.getFormatter formatter", function () {
    'use strict';

    var entryFormatter;
    beforeEach(function () {
        entryFormatter = new EntryFormatter($filter);
    });

    it('formatter should format field of type number', function () {
        var formatter = entryFormatter.getFormatter([getField({
            type: 'number',
            name: 'number',
            label: 'Number',
            format: '0.000%'
        })]);
        var number = 56;

        expect(formatter({ values: { number: number } })).toEqual({ Number: { filter: 'numeraljs',  value: 56, format: '0.000%' } });
    });

    it('formatter should format field of type text', function () {
        var formatter = entryFormatter.getFormatter([getField({
            type: 'text',
            name: 'text',
            label: 'Text'
        })]);

        expect(formatter({values: {text: 'Hello World'}})).toEqual({Text: 'Hello World'});
    });

    it('formatter should format field of type boolean', function () {
        var formatter = entryFormatter.getFormatter([getField({
            type: 'boolean',
            name: 'boolean',
            label: 'Boolean'
        })]);

        expect(formatter({values: {boolean: true}})).toEqual({Boolean: true});
    });

    it('formatter should format field of type reference', function () {
        var formatter = entryFormatter.getFormatter([getField({
            type: 'reference',
            name: 'reference',
            label: 'Reference'
        })]);

        expect(formatter({listValues: {reference: 'a reference'}})).toEqual({Reference: 'a reference'});
    });

    it('formatter should format field of type date', function () {
        var formatter = entryFormatter.getFormatter([getField({
            type: 'date',
            name: 'date',
            label: 'Date',
            format: 'yyyy/mm/dd'
        })]);
        var date = new Date();

        expect(formatter({values: {date: date}})).toEqual({Date: {
            filter: 'date',
            value: date,
            format: 'yyyy/mm/dd'
        }});
    });

    it ('formatter should discard unmapped field', function () {
        var formatter = entryFormatter.getFormatter([getField({
            type: 'text',
            name: 'mapped',
            label: 'Mapped'
        })]);

        expect(formatter({values: {mapped: 'mapped', unmapped: 'unmapped'}})).toEqual({Mapped: 'mapped'});

    });

    it ('formatter should not map unsupported field', function () {
        var formatter = entryFormatter.getFormatter([
            getField({
                type: 'unsupported',
                name: 'unsupported',
                label: 'Unsupported'
            }),
            getField({
                type: 'text',
                name: 'supported',
                label: 'Supported'
            })
        ]);

        expect(formatter({values: {supported: 'supported', unsupported: 'unsupported'}})).toEqual({Supported: 'supported'});

    });
});
