function getReadWidget() {
    return '<ma-wysiwyg-column field="::field" value="::entry.values[field.name()]"></ma-wysiwyg-column>';
}
function getLinkWidget() {
    return 'error: cannot display wysiwyg field as linkable';
}
function getFilterWidget() {
    return '<ma-input-field field="::field" value="values[field.name()]"></ma-input-field>';
}
function getWriteWidget() {
    return '<ma-wysiwyg-field field="::field" value="entry.values[field.name()]"></ma-wysiwyg-field>';
}

module.exports = {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget
};
