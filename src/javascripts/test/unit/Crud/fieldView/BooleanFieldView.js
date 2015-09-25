var assert = require('chai').assert;
var BooleanFieldView = require('../../../../ng-admin/Crud/fieldView/BooleanFieldView');

describe('BooleanFieldView', function() {
    describe('getReadWidget', function() {
        it('should return boolean column directive', function() {
            var widget = BooleanFieldView.getReadWidget();
            assert.include(widget, '<ma-boolean-column');
        });
    });

    describe('getLinkWidget', function() {
        it('should return boolean column directive', function() {
            var widget = BooleanFieldView.getLinkWidget();
            assert.include(widget, '<ma-boolean-column');
        });
    });

    describe('getFilterWidget', function() {
        it('should return choice field directive with true and false choices', function() {
            var widget = BooleanFieldView.getFilterWidget();
            assert.match(widget, /<ma-choice-field .* choices="\[{value: \'true\', label: \'true\' }, { value: \'false\', label: \'false\' }]"/);
        });
    });

    describe('getWriteWidget', function() {
        it('should return choice field directive with check for non required field', function() {
            var widget = BooleanFieldView.getWriteWidget();
            assert.match(widget, /<ma-choice-field .* ng-if="!field\.validation\(\)\.required" .*><\/ma-choice-field>/);
        });

        it('should return checkbox field directive with check for required field', function() {
            var widget = BooleanFieldView.getWriteWidget();
            assert.match(widget, /<ma-checkbox-field .* ng-if="!!field\.validation\(\)\.required" .*><\/ma-checkbox-field>/);
        });
    });
});
