export default {
    getReadWidget:   () => '<ma-choices-column values="::entry.listValues[field.name()]"></ma-choices-column>',
    getLinkWidget:   () => '<ma-reference-many-link-column ids="::value" values="::entry.listValues[field.name()]" field="::field"></ma-reference-many-link-column>',
    getFilterWidget: () => '<ma-choices-field field="::field" value="value" datastore="::datastore"></ma-choices-field>',
    getWriteWidget:  () => '<ma-reference-many-field field="::field" value="value" datastore="::datastore"></ma-reference-many-field>'
};
