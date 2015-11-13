export default {
    getReadWidget:   () => '<ma-date-column field="::field" value="::value"></ma-date-column>',
    getLinkWidget:   () => '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-date-field field="::field" value="value"></ma-date-field>',
    getWriteWidget:  () => '<div class="date_widget"><ma-date-field field="::field" value="value"></ma-date-field></div>'
};
