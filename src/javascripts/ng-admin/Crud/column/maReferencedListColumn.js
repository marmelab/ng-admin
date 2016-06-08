function isSortFieldForMe(sortField, field) {
    if (!sortField) return false;
    return sortField.split('.')[0] == (field.targetEntity().name() + '_ListView');
}

export default function maReferencedListColumn(NgAdminConfiguration, $stateParams) {
    return {
        scope: {
            'field': '&',
            'datastore': '&'
        },
        restrict: 'E',
        link: {
            pre: function(scope) {
                scope.field = scope.field();
                var targetEntity = scope.field.targetEntity();
                scope.entries = scope.datastore().getEntries(targetEntity.uniqueId + '_list');
                scope.entity = NgAdminConfiguration().getEntity(targetEntity.name());
                scope.sortField = isSortFieldForMe($stateParams.sortField, scope.field) ?
                    $stateParams.sortField :
                    scope.field.getSortFieldName();
                scope.sortDir = $stateParams.sortDir || scope.field.sortDir();
            }
        },
        template: `
<ma-datagrid ng-if="::entries.length > 0" name="{{ field.datagridName() }}"
    entries="::entries"
    fields="::field.targetFields()"
    list-actions="::field.listActions()"
    entity="::entity"
    sort-field="::sortField"
    sort-dir="::sortDir"
    datastore="::datastore()"
    entry-css-classes="::field.entryCssClasses()">
</ma-datagrid>`
    };
}

maReferencedListColumn.$inject = ['NgAdminConfiguration', '$stateParams'];
