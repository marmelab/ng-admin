module.exports = {
    getReadWidget:   () => '<ma-string-column value="::field.getLabelForChoice(entry.values[field.name()], entry)"></ma-string-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-choice-field field="::field" value="values[field.name()]"></ma-choice-field>',
    getWriteWidget:  () => '<ma-choice-field field="::field" entry="entry" value="entry.values[field.name()]"></ma-choice-field>'
};
