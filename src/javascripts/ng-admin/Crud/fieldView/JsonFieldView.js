define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-json-column value="::entry.values[field.name()]"></ma-json-column>';
    }
    function getLinkWidget() {
        return 'error: cannot display a json field as linkable';
    }
    function getFilterWidget() {
        return '<ma-input-field field="::field" value="values[field.name()]"></ma-input-field>';
    }
    function getWriteWidget() {
        return '<ma-json-field field="::field" value="entry.values[field.name()]"></ma-json-field>';
    }
    return {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget,
    }
});
