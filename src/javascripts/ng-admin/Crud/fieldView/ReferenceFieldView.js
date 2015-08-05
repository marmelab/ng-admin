module.exports = {
    getReadWidget:   () => '<ma-string-column value="::entry.listValues[field.name()]"></ma-string-column>',
    getLinkWidget:   () => '<a ng-click="gotoReference()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-reference-field field="::field" value="values[field.name()]" datastore="::datastore"></ma-reference-field>',
    getWriteWidget:  () => '<ma-reference-field field="::field" value="entry.values[field.name()]" datastore="::datastore"></ma-reference-field>'
};
