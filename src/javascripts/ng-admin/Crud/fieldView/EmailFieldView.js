module.exports = {
    getReadWidget:   () => '<ma-string-column value="::entry.values[field.name()]"></ma-string-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-input-field field="::field" value="values[field.name()]"></ma-input-field>',
    getWriteWidget:  () => '<ma-input-field type="email" field="::field" value="entry.values[field.name()]"></ma-input-field>'
};
