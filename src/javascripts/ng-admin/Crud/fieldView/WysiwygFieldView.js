module.exports = {
    getReadWidget:   () => '<ma-wysiwyg-column field="::field" value="::value"></ma-wysiwyg-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-input-field field="::field" value="value"></ma-input-field>',
    getWriteWidget:  () => '<ma-wysiwyg-field field="::field" value="value"></ma-wysiwyg-field>'
};
