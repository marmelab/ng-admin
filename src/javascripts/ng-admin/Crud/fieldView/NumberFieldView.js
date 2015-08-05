module.exports = {
    getReadWidget:   () => '<ma-number-column field="::field" value="::entry.values[field.name()]"></ma-number-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-input-field type="number" field="::field" value="values[field.name()]"></ma-input-field>',
    getWriteWidget:  () => '<ma-input-field type="number" field="::field" value="entry.values[field.name()]"></ma-input-field>'
};
