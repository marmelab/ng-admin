export default {
    getReadWidget:   () => 'error: cannot display file field as readable',
    getLinkWidget:   () => 'error: cannot display file field as linkable',
    getFilterWidget: () => 'error: cannot display file field as filter',
    getWriteWidget:  () => '<ma-file-field field="::field" value="value"></ma-file-field> <ma-help-text field="field"></ma-help-text>'
};
