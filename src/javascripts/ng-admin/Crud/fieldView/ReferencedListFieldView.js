define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-datagrid name="{{ field.getReferencedView().name() }}" ' +
                 'entries="field.entries" ' +
                 'fields="::field.getReferencedView().fields() | orderElement" ' +
                 'list-actions="::field.listActions()" ' +
                 'entity="::field.getReferencedView().entity">' +
            '</ma-datagrid>';
    }
    function getLinkWidget() {
        return 'error: cannot display referenced_list field as linkable';
    }
    function getFilterWidget() {
        return 'error: cannot display referenced_list field as filter';
    }
    function getWriteWidget() {
        return '<ma-datagrid name="{{ field.getReferencedView().name() }}"' +
                  'entries="field.entries" ' +
                  'fields="::field.getReferencedView().fields() | orderElement" ' +
                  'list-actions="::field.listActions()" ' +
                  'entity="::field.getReferencedView().entity">' +
            '</ma-datagrid>';
    }
    return {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget,
    }
});
