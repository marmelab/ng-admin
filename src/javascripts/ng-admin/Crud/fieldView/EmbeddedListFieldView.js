module.exports = {
    getReadWidget:   () => '<ma-embedded-list-column field="::field" value="::value"></ma-embedded-list-column>',
    getLinkWidget:   () => 'error: cannot display referenced_list field as linkable',
    getFilterWidget: () => 'error: cannot display referenced_list field as filter',
    getWriteWidget:  () => 'error: cannot display referenced_list field as editable'
};
