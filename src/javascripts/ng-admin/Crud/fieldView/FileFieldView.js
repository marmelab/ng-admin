define(function(require) {
    "use strict";

    function getReadWidget() {
        return 'error: cannot display file field as readable';
    }
    function getLinkWidget() {
        return 'error: cannot display file field as linkable';
    }
    function getFilterWidget() {
        return 'error: cannot display file field as filter';
    }
    function getWriteWidget() {
        return '<ma-file-field field="::field" value="entry.values[field.name()]"></ma-file-field>';
    }
    return {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget,
    }
});
