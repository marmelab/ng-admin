export default {
    getReadWidget:   () => 'error: cannot display password field as readable',
    getLinkWidget:   () => 'error: cannot display password field as linkable',
    getFilterWidget: () => 'error: cannot display password field as filter',
    getWriteWidget:  () => '<ma-input-field type="password" field="::field" value="value"></ma-input-field> <ma-help-text field="field"></ma-help-text>'
};
