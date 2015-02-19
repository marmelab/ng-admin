define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-json-column value="::entry.values[field.name()]"></ma-json-column>';
    }
    function getLinkWidget() {
        return 'error: cannot display a json field as linkable';
    }
    function getWriteWidget() {
        return '<ma-json-field field="::field" value="entry.values[field.name()]"></ma-json-field>';
    }
    return {
        getReadWidget:  getReadWidget,
        getLinkWidget:  getLinkWidget,
        getWriteWidget: getWriteWidget,
    }
});
