export default {
    getReadWidget:   () => '<ma-wysiwyg-column field="::field" value="::value"></ma-wysiwyg-column>',
    getLinkWidget:   () => '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-input-field field="::field" value="value"></ma-input-field>',
    getWriteWidget:  () => '<ma-wysiwyg-field field="::field" value="value"></ma-wysiwyg-field> <ma-help-text field="field"></ma-help-text>'
};
