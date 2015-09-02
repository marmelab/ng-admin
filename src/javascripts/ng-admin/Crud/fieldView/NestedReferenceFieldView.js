var ReferenceFieldView = require('./ReferenceFieldView');

module.exports = {
    getReadWidget:   () => '<ma-string-column value="::field.labelDisplay(entry)"></ma-string-column>',
    getLinkWidget:   () => '<a ng-click="gotoReference()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => ReferenceFieldView.getFilterWidget(),
    getWriteWidget:  () => ReferenceFieldView.getWriteWidget()
};
