define(function(require) {
    "use strict";

    function getReadWidget() {
        return 'error: cannot display password field as readable';
    }
    function getLinkWidget() {
        return 'error: cannot display password field as linkable';
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
