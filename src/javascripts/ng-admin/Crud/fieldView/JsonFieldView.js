module.exports = {
    getReadWidget:   () => '<ma-json-column value="::value"></ma-json-column>',
    getLinkWidget:   () => 'error: cannot display a json field as linkable',
    getFilterWidget: () => '<ma-input-field field="::field" value="value"></ma-input-field>',
    getWriteWidget:  () => '<ma-json-field field="::field" value="value"></ma-json-field>'
};
