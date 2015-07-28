module.exports = {
    getReadWidget:   () => '<ma-json-column value="::entry.values[field.name()]"></ma-json-column>',
    getLinkWidget:   () => 'error: cannot display a json field as linkable',
    getFilterWidget: () => '<ma-input-field field="::field" value="values[field.name()]"></ma-input-field>',
    getWriteWidget:  () => '<ma-json-field field="::field" value="entry.values[field.name()]"></ma-json-field>'
};
