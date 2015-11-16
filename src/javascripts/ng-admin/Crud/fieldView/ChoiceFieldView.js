export default {
    getReadWidget:   () => '<ma-string-column value="::field.getLabelForChoice(value, entry)"></ma-string-column>',
    getLinkWidget:   () => '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-choice-field field="::field" value="value"></ma-choice-field>',
    getWriteWidget:  () => '<ma-choice-field field="::field" entry="entry" value="value"></ma-choice-field>'
};
