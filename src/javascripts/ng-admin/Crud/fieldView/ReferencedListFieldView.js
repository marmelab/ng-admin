export default {
    getReadWidget:   () => '<ma-referenced-list-column field="::field" datastore="::datastore"></ma-referenced-list-column>',
    getLinkWidget:   () => 'error: cannot display referenced_list field as linkable',
    getFilterWidget: () => 'error: cannot display referenced_list field as filter',
    getWriteWidget:  () => '<ma-referenced-list-column field="::field" datastore="::datastore"></ma-referenced-list-column> <ma-help-text field="field"></ma-help-text>'
};
