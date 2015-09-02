module.exports = {
    getReadWidget:  () =>
      '<ma-datagrid name="{{ field.datagridName() }}" ' +
           'entries="::entry.values[field.name()]" ' +
           'fields="::field.targetFields()" ' +
           'list-actions="::field.listActions()" ' +
           'entity="::field.targetEntity()">' +
      '</ma-datagrid>',
    getLinkWidget:   () => 'error: cannot display referenced_list field as linkable',
    getFilterWidget: () => 'error: cannot display referenced_list field as filter',
    getWriteWidget:  () =>
      '<ma-datagrid name="{{ field.datagridName() }}"' +
            'entries="::entry.values[field.name()]" ' +
            'fields="::field.targetFields()" ' +
            'list-actions="::field.listActions()" ' +
            'entity="::field.targetEntity()">' +
      '</ma-datagrid>'
};
