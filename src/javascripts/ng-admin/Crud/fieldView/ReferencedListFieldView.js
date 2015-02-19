define(function(require) {
    "use strict";

    function getReadWidget() {
        // special case: will cause recursion in listView if returning datagrid
        return '';
        /**
        return '<ma-datagrid name="{{ field.getReferencedView().name() }}" ' +
                 'entries="field.entries" ' +
                 'fields="::field.getReferencedView().fields() | orderElement" ' +
                 'list-actions="::field.listActions()" ' +
                 'entity="::field.getReferencedView().entity">' +
            '</ma-datagrid>';
        **/
    }
    function getLinkWidget() {
        return 'error: cannot display referenced_list field as linkable';
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
        getReadWidget:  getReadWidget,
        getLinkWidget:  getLinkWidget,
        getWriteWidget: getWriteWidget,
    }
});
