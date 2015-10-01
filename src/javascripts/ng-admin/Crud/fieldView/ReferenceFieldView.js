module.exports = {
    getReadWidget:   () => '<ma-reference-column field="::field" value="::value" datastore="::datastore"></ma-reference-column>',
    getLinkWidget:   () => '<a ng-click="gotoReference()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-reference-field field="::field" value="value" datastore="::datastore"></ma-reference-field>',
    getWriteWidget:  () => '<ma-reference-field field="::field" value="value" datastore="::datastore"></ma-reference-field>'
};
