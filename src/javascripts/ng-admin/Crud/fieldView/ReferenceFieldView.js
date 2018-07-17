export default {
    getReadWidget:   () => '<ma-reference-column field="::field" value="::value" datastore="::datastore"></ma-reference-column>',
    getLinkWidget:   () => '<ma-reference-link-column entry="::entry" field="::field" value="::value" datastore="::datastore"></ma-reference-link-column>',
    getFilterWidget: () => '<ma-reference-field field="::field" value="value" datastore="::datastore"></ma-reference-field>',
    getWriteWidget:  () => '<ma-reference-field entry="::entry" field="::field" value="value" datastore="::datastore"></ma-reference-field>'
};
