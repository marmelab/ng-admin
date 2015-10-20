module.exports = {
    getReadWidget:   () => '<ma-date-column field="::field" value="::value"></ma-date-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-date-field field="::field" value="value"></ma-date-field>',
    getWriteWidget:  () => '<div class="datetime_widget"><ma-date-field field="::field" value="value"></ma-date-field></div>'
};
