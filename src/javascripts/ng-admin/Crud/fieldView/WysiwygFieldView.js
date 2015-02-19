define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-wysiwyg-column value="::entry.values[field.name()]|stripTags"></ma-wysiwyg-column>';
    }
    function getLinkWidget() {
        return 'error: cannot display wysiwyg field as linkable';
    }
    function getWriteWidget() {
        return '<ma-wysiwyg-field field="::field" value="entry.values[field.name()]"></ma-wysiwyg-field>';
    }
    return {
        getReadWidget:  getReadWidget,
        getLinkWidget:  getLinkWidget,
        getWriteWidget: getWriteWidget,
    }
});
