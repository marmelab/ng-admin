module.exports = {
    getReadWidget:   () => 'error: cannot display file field as readable',
    getLinkWidget:   () => 'error: cannot display file field as linkable',
    getFilterWidget: () => 'error: cannot display file field as filter',
    getWriteWidget:  () => '<ma-file-field field="::field" value="entry.values[field.name()]"></ma-file-field>'
};
