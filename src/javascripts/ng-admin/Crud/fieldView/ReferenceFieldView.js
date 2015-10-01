module.exports = {
    getReadWidget:   () => '<ma-reference-column field="::field" value="::value" datastore="::datastore"></ma-reference-column>',
    getLinkWidget:   () => '<a ng-click="gotoReference()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: module.exports.getWriteWidget,
    getWriteWidget:  () => '<ma-reference-field field="::field" value="value" datastore="::datastore"></ma-reference-field>'
};
