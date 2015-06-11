module.exports = {
    getReadWidget: function() {
        return '<ma-string-column value="::field.getLabelForChoice(entry.values[field.name()], entry)"></ma-string-column>';
    },
    getLinkWidget: function() {
        '<a ng-click="gotoDetail()">' + getReadWidget() + '</a>'
    },
    getFilterWidget: function() {
        return '<ma-choice-field field="::field" value="values[field.name()]"></ma-choice-field>';
    },
    getWriteWidget: function() {
        return '<ma-choice-field field="::field" entry="entry" value="entry.values[field.name()]"></ma-choice-field>';
    }
};
