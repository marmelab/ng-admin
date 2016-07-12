export default {
    getReadWidget:   () => '<ma-embedded-list-column field="::field" value="::value" datastore="::datastore"></ma-embedded-list-column>',
    getLinkWidget:   () => 'error: cannot display referenced_list field as linkable',
    getFilterWidget: () => 'error: cannot display referenced_list field as filter',
    getWriteWidget:  () => '<ma-embedded-list-field field="::field" value="value" datastore="::datastore"></ma-embedded-list-field> <ma-help-text field="field"></ma-help-text>'
};
