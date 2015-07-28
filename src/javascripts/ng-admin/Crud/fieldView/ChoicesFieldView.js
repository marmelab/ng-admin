module.exports = {
    getReadWidget:   () => '<ma-choices-column values="::entry.values[field.name()]"></ma-choices-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-choices-field field="::field" value="values[field.name()]"></ma-choices-field>',
    getWriteWidget:  () => '<ma-choices-field field="::field" entry="::entry" value="entry.values[field.name()]"></ma-choices-field>'
};
