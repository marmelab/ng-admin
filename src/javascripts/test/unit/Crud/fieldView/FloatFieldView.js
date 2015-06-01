var assert = require('chai').assert;
var FloatFieldView = require('../../../../ng-admin/Crud/fieldView/FloatFieldView');

describe('FloatFieldView', function() {
    describe('getReadWidget', function() {
        it('should return number column directive', function() {
            var widget = FloatFieldView.getReadWidget();
            assert.include(widget, '<ma-number-column');
        });
    });

    describe('getLinkWidget', function() {
        it('should return number column directive', function() {
            var widget = FloatFieldView.getLinkWidget();
            assert.include(widget, '<ma-number-column');
        });
    });

    describe('getFilterWidget', function() {
        it('should set step attribute to "any"', function() {
            var widget = FloatFieldView.getFilterWidget();
            assert.include(widget, 'step="any"');
        });
    });

    describe('getWriteWidget', function() {
        it('should set step attribute to "any"', function() {
            var widget = FloatFieldView.getFilterWidget();
            assert.include(widget, 'step="any"');
        });
    });
});
