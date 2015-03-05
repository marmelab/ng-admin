/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var Validator = require('ng-admin/Main/component/service/Validator'),
        View = require('ng-admin/es6/lib/View/View'),
        Entry = require('ng-admin/es6/lib/Entry'),
        Field = require('ng-admin/es6/lib/Field/Field');

    describe("Service: Validator", function () {

        it('should call validator on each fields.', function () {
            var validator = new Validator(),
                entry = new Entry(),
                view = new View('myView'),
                field1 = new Field('notValidable').label('Complex'),
                field2 = new Field('simple').label('Simple');

            entry.values = {
                notValidable: false,
                simple: 1
            };

            view.addField(field1).addField(field2);

            field1.validation().validator = function () {
                throw new Error('Field "Complex" is not valid.');
            };
            field2.validation().validator = function () {
                return true;
            };

            expect(function () { validator.validate(view, entry); }).toThrow(new Error('Field "Complex" is not valid.'));
        });

    });
});
