module.exports = {
    getReadWidget:   () => '<ma-wysiwyg-column field="::field" value="::entry.values[field.name()]"></ma-wysiwyg-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-input-field field="::field" value="values[field.name()]"></ma-input-field>',
    getWriteWidget:  () => '<ma-wysiwyg-field field="::field" value="entry.values[field.name()]"></ma-wysiwyg-field>'
};
