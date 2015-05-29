define(function(require) {
    "use strict";

    function getReadWidget() {
        return '<ma-datagrid name="{{ field.datagridName() }}" ' +
                 'entries="::datastore.getEntries(field.targetEntity().uniqueId + \'_list\')" ' +
                 'fields="::field.targetFields()" ' +
                 'list-actions="::field.listActions()" ' +
                 'entity="::field.targetEntity()" ' +
                 'sort-field="::field.getSortFieldName()" ' +
                 'sort-dir="::field.sortDir()">' +
            '</ma-datagrid>';
    }
    function getLinkWidget() {
        return 'error: cannot display referenced_list field as linkable';
    }
    function getFilterWidget() {
        return 'error: cannot display referenced_list field as filter';
    }
    function getWriteWidget() {
        return '<ma-datagrid name="{{ field.datagridName() }}"' +
                  'entries="::datastore.getEntries(field.targetEntity().uniqueId + \'_list\')" ' +
                  'fields="::field.targetFields()" ' +
                  'list-actions="::field.listActions()" ' +
                  'entity="::field.targetEntity()" ' +
                  'sort-field="::field.getSortFieldName()" ' +
                  'sort-dir="::field.sortDir()">' +
            '</ma-datagrid>';
    }
    return {
        getReadWidget:   getReadWidget,
        getLinkWidget:   getLinkWidget,
        getFilterWidget: getFilterWidget,
        getWriteWidget:  getWriteWidget,
    };
});
