export default {
    getReadWidget:   () => '<ma-choices-column values="::value"></ma-choices-column>',
    getLinkWidget:   () => '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-choices-field field="::field" value="value"></ma-choices-field>',
    getWriteWidget:  () => '<ma-choices-field field="::field" entry="::entry" value="value"></ma-choices-field> <ma-help-text field="field"></ma-help-text>'
};
