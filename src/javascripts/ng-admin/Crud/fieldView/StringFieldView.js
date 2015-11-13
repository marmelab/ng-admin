export default {
    getReadWidget:   () => '<ma-string-column value="::value"></ma-string-column>',
    getLinkWidget:   () => '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-input-field field="::field" value="value"></ma-input-field>',
    getWriteWidget:  () => '<ma-input-field field="::field" value="value"></ma-input-field>'
};
