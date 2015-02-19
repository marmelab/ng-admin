define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-password-column></ma-password-column>';
    }
    function getLinkWidget() {
        return 'error: cannot dislplay password field as linkable';
    }
    function getWriteWidget() {
        return '<ma-input-field type="password" field="::field" value="entry.values[field.name()]"></ma-input-field>';
    }
    return {
        getReadWidget:  getReadWidget,
        getLinkWidget:  getLinkWidget,
        getWriteWidget: getWriteWidget,
    }
});
