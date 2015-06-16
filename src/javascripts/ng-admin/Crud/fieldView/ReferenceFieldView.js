module.exports = {
    getReadWidget: function () {
        return '<ma-string-column value="::entry.listValues[field.name()]"></ma-string-column>';
    },
    getLinkWidget: function () {
        return '<a ng-click="gotoReference()">' + getReadWidget() + '</a>';
    },
    getFilterWidget: function () {
        return '<ma-reference-field field="::field" value="values[field.name()]" datastore="::datastore"></ma-reference-field>';
    },
    getWriteWidget:  function getWriteWidget() {
        return '<ma-reference-field field="::field" value="entry.values[field.name()]" datastore="::datastore"></ma-reference-field>';
    }
};
