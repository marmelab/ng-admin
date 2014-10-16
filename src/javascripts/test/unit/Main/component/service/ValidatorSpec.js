/*global require,describe,module,beforeEach,inject,it,expect*/

define(function(require) {
    'use strict';

    var Validator = require('ng-admin/Main/component/service/Validator'),
        View = require('ng-admin/Main/component/service/config/view/View'),
        Field = require('ng-admin/Main/component/service/config/Field');

    describe("Service: Validator", function() {

        it('should call validator on each fields.', function() {
            var validator = new Validator(),
                view = new View('myView'),
                field1 = new Field('notValidable').label('Complex'),
                field2 = new Field('simple').label('Simple');

            view.addField(field1).addField(field2);

            field1.validation().validator = function() {
                return false;
            };
            field2.validation().validator = function() {
                return true;
            };

            expect(function(){ validator.validate(view); } ).toThrow(new Error('Field "Complex" is not valid.'));
        });

    });
});
