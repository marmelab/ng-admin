module.exports = {
    getReadWidget: function() {
        return '<ma-number-column field="::field" value="::entry.values[field.name()]"></ma-number-column>';
    },
    getLinkWidget: function() {
        return '<a ng-click="gotoDetail()">' + this.getReadWidget() + '</a>';
    },
    getFilterWidget: function() {
        return '<ma-input-field type="number" step="any" field="::field" value="values[field.name()]"></ma-input-field>';
    },
    getWriteWidget: function() {
        return '<ma-input-field type="number" step="any" field="::field" value="entry.values[field.name()]"></ma-input-field>';
    }
};
