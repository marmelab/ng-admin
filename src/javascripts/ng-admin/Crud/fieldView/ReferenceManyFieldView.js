define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-choices-column values="::entry.listValues[field.name()]"></ma-choices-column>';
    }
    function getLinkWidget() {
        return '<ma-reference-many-link-column ids="::entry.values[field.name()]" values="::entry.listValues[field.name()]" field="::field"></ma-reference-many-link-column>';
    }
    function getFilterWidget() {
        return '<ma-choices-field field="::field" value="values[field.name()]"></ma-choices-field>';
    }
    function getWriteWidget() {
        return '<ma-choices-field field="::field" value="entry.values[field.name()]"></ma-choices-field>';
    }
    return {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget,
    }
});
