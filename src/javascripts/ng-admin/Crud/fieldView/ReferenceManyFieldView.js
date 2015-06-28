module.exports = {
    getReadWidget:   function () {
        return '<ma-choices-column values="::entry.listValues[field.name()]"></ma-choices-column>';
    },
    getLinkWidget:   function () {
        return '<ma-reference-many-link-column ids="::entry.values[field.name()]" values="::entry.listValues[field.name()]" field="::field"></ma-reference-many-link-column>';
    },
    getFilterWidget: function () {
        return '<ma-choices-field field="::field" value="values[field.name()]" datastore="::datastore"></ma-choices-field>';
    },
    getWriteWidget:  function () {
        return '<ma-reference-many-field field="::field" value="entry.values[field.name()]" datastore="::datastore"></ma-reference-many-field>';
    }
};
