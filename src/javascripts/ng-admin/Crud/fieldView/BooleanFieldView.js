module.exports = {
    getReadWidget:   () => '<ma-boolean-column value="::entry.values[field.name()]"></ma-boolean-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>', 
    getFilterWidget: () => '<ma-checkbox-field field="::field" value="values[field.name()]"></ma-checkbox-field>',
    getWriteWidget:  () => '<ma-checkbox-field field="::field" value="entry.values[field.name()]"></ma-checkbox-field>'
}
