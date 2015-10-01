module.exports = {
    getReadWidget:   () => '<ma-date-column field="::field" value="::value"></ma-date-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-date-field field="::field" value="value"></ma-date-field>',
    getWriteWidget:  () => '<div class="row"><div class="col-sm-7 col-lg-6"><ma-date-field field="::field" value="value"></ma-date-field></div></div>'
};
