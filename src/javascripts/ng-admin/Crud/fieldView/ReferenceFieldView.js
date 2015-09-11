module.exports = {
    getReadWidget:   () => '<ma-reference-column field="::field" value="::entry.values[field.name()]" datastore="::datastore"></ma-reference-column>',
    getLinkWidget:   () => '<a ng-click="gotoReference()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-reference-field field="::field" value="values[field.name()]" datastore="::datastore"></ma-reference-field>',
    getWriteWidget:  () => '<ma-reference-field field="::field" value="entry.values[field.name()]" datastore="::datastore"></ma-reference-field>'
};
