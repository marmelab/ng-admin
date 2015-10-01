module.exports = {
    getReadWidget:   () => '<ma-number-column field="::field" value="::value"></ma-number-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-input-field type="number" field="::field" value="value"></ma-input-field>',
    getWriteWidget:  () => '<ma-input-field type="number" field="::field" value="value"></ma-input-field>'
};
