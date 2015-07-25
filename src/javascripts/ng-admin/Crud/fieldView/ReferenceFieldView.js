module.exports = {
    getReadWidget: function () {
        return '<ma-column field="::field.targetField()" entry="::field.getEntry(entry.values[field.name()])" entity="::field.targetEntity()" datastore="::datastore()"></ma-column>';
    },
    getLinkWidget: function () {
        return '<a ng-click="gotoReference()">' + this.getReadWidget() + '</a>';
    },
    getFilterWidget: function () {
        return '<ma-reference-field field="::field" value="values[field.name()]" datastore="::datastore"></ma-reference-field>';
    },
    getWriteWidget:  function getWriteWidget() {
        return '<ma-reference-field field="::field" value="entry.values[field.name()]" datastore="::datastore"></ma-reference-field>';
    }
};
